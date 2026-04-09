import { BooleanRequest, EmptyRequest, StringArrayRequest } from "@shared/proto/cline/common"
import { GetTaskHistoryRequest, TaskFavoriteRequest } from "@shared/proto/cline/task"
import { memo, useCallback, useEffect, useMemo, useState } from "react"
import { GroupedVirtuoso } from "react-virtuoso"
import { Button } from "@/components/ui/button"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { TaskServiceClient } from "@/services/grpc-client"
import { formatSize } from "@/utils/format"
import ViewHeader from "../common/ViewHeader"
import HistoryViewItem from "./HistoryViewItem"

type HistoryViewProps = {
	onDone: () => void
}

const isToday = (timestamp: number): boolean => {
	const date = new Date(timestamp)
	const today = new Date()
	return today.toDateString() === date.toDateString()
}

const HistoryView = ({ onDone }: HistoryViewProps) => {
	const extensionStateContext = useExtensionState()
	const { taskHistory, onRelinquishControl, environment } = extensionStateContext
	const [deleteAllDisabled, setDeleteAllDisabled] = useState(false)
	const [selectedItems, setSelectedItems] = useState<string[]>([])

	// Keep track of pending favorite toggle operations
	const [pendingFavoriteToggles, setPendingFavoriteToggles] = useState<Record<string, boolean>>({})

	// Load filtered task history with gRPC
	const [tasks, setTasks] = useState<any[]>([])

	// Load and refresh task history
	const loadTaskHistory = useCallback(async () => {
		try {
			const response = await TaskServiceClient.getTaskHistory(
				GetTaskHistoryRequest.create({
					sortBy: "newest",
				}),
			)
			setTasks(response.tasks || [])
		} catch (error) {
			console.error("Error loading task history:", error)
		}
	}, [])

	// Load on mount
	useEffect(() => {
		loadTaskHistory()
	}, [loadTaskHistory])

	const toggleFavorite = useCallback(
		async (taskId: string, currentValue: boolean) => {
			// Optimistic UI update
			setPendingFavoriteToggles((prev) => ({ ...prev, [taskId]: !currentValue }))

			try {
				await TaskServiceClient.toggleTaskFavorite(
					TaskFavoriteRequest.create({
						taskId,
						isFavorited: !currentValue,
					}),
				)
			} catch (err) {
				console.error(`[FAVORITE_TOGGLE_UI] Error for task ${taskId}:`, err)
				// Revert optimistic update
				setPendingFavoriteToggles((prev) => {
					const updated = { ...prev }
					delete updated[taskId]
					return updated
				})
			} finally {
				// Clean up pending state after 1 second
				setTimeout(() => {
					setPendingFavoriteToggles((prev) => {
						const updated = { ...prev }
						delete updated[taskId]
						return updated
					})
				}, 1000)
			}
		},
		[loadTaskHistory],
	)

	// Use the onRelinquishControl hook instead of message event
	useEffect(() => {
		return onRelinquishControl(() => {
			setDeleteAllDisabled(false)
		})
	}, [onRelinquishControl])

	const { totalTasksSize, setTotalTasksSize } = extensionStateContext

	const fetchTotalTasksSize = useCallback(async () => {
		try {
			const response = await TaskServiceClient.getTotalTasksSize(EmptyRequest.create({}))
			if (response && typeof response.value === "number") {
				setTotalTasksSize?.(response.value || 0)
			}
		} catch (error) {
			console.error("Error getting total tasks size:", error)
		}
	}, [setTotalTasksSize])

	// Request total tasks size when component mounts
	useEffect(() => {
		fetchTotalTasksSize()
	}, [fetchTotalTasksSize])

	const handleHistorySelect = useCallback((itemId: string, checked: boolean) => {
		setSelectedItems((prev) => {
			if (checked) {
				return [...prev, itemId]
			}
			return prev.filter((id) => id !== itemId)
		})
	}, [])

	const handleDeleteHistoryItem = useCallback(
		(id: string) => {
			TaskServiceClient.deleteTasksWithIds(StringArrayRequest.create({ value: [id] }))
				.then(() => fetchTotalTasksSize())
				.catch((error) => console.error("Error deleting task:", error))
		},
		[fetchTotalTasksSize],
	)

	const handleDeleteSelectedHistoryItems = useCallback(
		(ids: string[]) => {
			if (ids.length > 0) {
				TaskServiceClient.deleteTasksWithIds(StringArrayRequest.create({ value: ids }))
					.then(() => fetchTotalTasksSize())
					.catch((error) => console.error("Error deleting tasks:", error))
				setSelectedItems([])
			}
		},
		[fetchTotalTasksSize],
	)

	const taskHistorySearchResults = useMemo(() => {
		// Sort by newest first (default)
		const results = [...tasks]
		results.sort((a, b) => b.ts - a.ts)
		return results
	}, [tasks])

	// Group tasks into "Today" and "Older"
	const { groupedTasks, groupCounts, groupLabels } = useMemo(() => {
		const todayTasks: any[] = []
		const olderTasks: any[] = []

		taskHistorySearchResults.forEach((task) => {
			if (isToday(task.ts)) {
				todayTasks.push(task)
			} else {
				olderTasks.push(task)
			}
		})

		const groups: { tasks: any[]; label: string }[] = []
		if (todayTasks.length > 0) {
			groups.push({ tasks: todayTasks, label: "Today" })
		}
		if (olderTasks.length > 0) {
			groups.push({ tasks: olderTasks, label: "Older" })
		}

		return {
			groupedTasks: groups.flatMap((g) => g.tasks),
			groupCounts: groups.map((g) => g.tasks.length),
			groupLabels: groups.map((g) => g.label),
		}
	}, [taskHistorySearchResults])

	// Calculate total size of selected items
	const selectedItemsSize = useMemo(() => {
		if (selectedItems.length === 0) {
			return 0
		}

		return taskHistory.filter((item) => selectedItems.includes(item.id)).reduce((total, item) => total + (item.size || 0), 0)
	}, [selectedItems, taskHistory])

	const handleBatchHistorySelect = useCallback(
		(selectAll: boolean) => {
			if (selectAll) {
				setSelectedItems(taskHistorySearchResults.map((item) => item.id))
			} else {
				setSelectedItems([])
			}
		},
		[taskHistorySearchResults],
	)

	return (
		<div className="fixed overflow-hidden inset-0 flex flex-col w-full">
			{/* HEADER */}
			<ViewHeader environment={environment} onDone={onDone} title="History" />

			{/* HISTORY ITEMS */}
			<div className="flex-grow overflow-y-auto m-0 w-full py-2">
				<GroupedVirtuoso
					className="flex-grow overflow-y-scroll"
					groupContent={(index) => (
						<div className="px-4 py-2 text-xs font-bold uppercase tracking-wide sticky top-0 z-10 text-description bg-sidebar-background border-b-border-panel">
							{groupLabels[index]}
						</div>
					)}
					groupCounts={groupCounts}
					itemContent={(index) => {
						const item = groupedTasks[index]
						return (
							<HistoryViewItem
								handleDeleteHistoryItem={handleDeleteHistoryItem}
								handleHistorySelect={handleHistorySelect}
								index={index}
								item={item}
								pendingFavoriteToggles={pendingFavoriteToggles}
								selectedItems={selectedItems}
								toggleFavorite={toggleFavorite}
							/>
						)
					}}
				/>
			</div>

			{/* FOOTER */}
			<div className="p-2.5 border-t border-t-border-panel">
				<div className="flex gap-2.5 mb-2.5">
					<Button className="flex-1" onClick={() => handleBatchHistorySelect(true)} variant="secondary">
						Select All
					</Button>
					<Button className="flex-1" onClick={() => handleBatchHistorySelect(false)} variant="secondary">
						Select None
					</Button>
				</div>
				{selectedItems.length > 0 ? (
					<Button
						aria-label="Delete selected items"
						className="w-full"
						onClick={() => {
							handleDeleteSelectedHistoryItems(selectedItems)
						}}
						variant="danger">
						Delete {selectedItems.length > 1 ? selectedItems.length : ""} Selected
						{selectedItemsSize > 0 ? ` (${formatSize(selectedItemsSize)})` : ""}
					</Button>
				) : (
					<Button
						aria-label="Delete all history"
						className="w-full"
						disabled={deleteAllDisabled || taskHistory.length === 0}
						onClick={() => {
							setDeleteAllDisabled(true)
							TaskServiceClient.deleteAllTaskHistory(BooleanRequest.create({}))
								.then(() => fetchTotalTasksSize())
								.catch((error) => console.error("Error deleting task history:", error))
								.finally(() => setDeleteAllDisabled(false))
						}}
						variant="danger">
						Delete All History{totalTasksSize !== null ? ` (${formatSize(totalTasksSize)})` : ""}
					</Button>
				)}
			</div>
		</div>
	)
}

export default memo(HistoryView)
