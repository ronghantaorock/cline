// Account button functionality has been removed
// This is a stub file to maintain compatibility with generated code

import { Empty, EmptyRequest } from "@shared/proto/cline/common"
import { StreamingResponseHandler } from "../grpc-handler"

/**
 * Subscribe to account button clicked events
 * @deprecated Account button has been removed
 */
export async function subscribeToAccountButtonClicked(
	_controller: unknown,
	_request: EmptyRequest,
	_responseStream: StreamingResponseHandler<Empty>,
	_requestId?: string,
): Promise<void> {
	// Account button has been removed, this is a no-op
}

/**
 * Send an account button clicked event to all active subscribers
 * @deprecated Account button has been removed
 */
export async function sendAccountButtonClickedEvent(): Promise<void> {
	// Account button has been removed, this is a no-op
}
