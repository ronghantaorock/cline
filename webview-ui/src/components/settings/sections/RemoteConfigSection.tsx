interface RemoteConfigSectionProps {
	renderSectionHeader: (tabId: string) => JSX.Element | null
}

export function RemoteConfigSection({ renderSectionHeader }: RemoteConfigSectionProps) {
	return (
		<div>
			{renderSectionHeader("remote-config")}
			<div>Remote config is not available.</div>
		</div>
	)
}
