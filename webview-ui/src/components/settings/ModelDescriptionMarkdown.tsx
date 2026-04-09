import { memo, useEffect } from "react"
import { useRemark } from "react-remark"

interface ModelDescriptionMarkdownProps {
	markdown?: string
	key: string
	isPopup?: boolean
}

export const ModelDescriptionMarkdown = memo(({ markdown, key }: ModelDescriptionMarkdownProps) => {
	// Update the markdown content when the prop changes
	const [reactContent, setMarkdown] = useRemark()

	useEffect(() => {
		if (markdown) {
			setMarkdown(markdown)
		}
	}, [markdown, setMarkdown])

	return (
		<div className="inline-block mb-2 description" key={key}>
			<div className="wrap-anywhere">
				<div className="overflow-hidden text-sm">{reactContent}</div>
			</div>
		</div>
	)
})
ModelDescriptionMarkdown.displayName = "ModelDescriptionMarkdown"
