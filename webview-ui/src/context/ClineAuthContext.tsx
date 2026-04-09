import type { UserOrganization } from "@shared/proto/cline/account"
import type React from "react"
import { createContext, useContext, useMemo, useState } from "react"

// Define User type (you may need to adjust this based on your actual User type)
export interface ClineUser {
	uid: string
	email?: string
	displayName?: string
	photoUrl?: string
	appBaseUrl?: string
}

export interface ClineAuthContextType {
	clineUser: ClineUser | null
	organizations: UserOrganization[] | null
	activeOrganization: UserOrganization | null
}

export const ClineAuthContext = createContext<ClineAuthContextType | undefined>(undefined)

export const ClineAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user] = useState<ClineUser | null>(null)
	const [userOrganizations] = useState<UserOrganization[] | null>(null)

	const activeOrganization = useMemo(() => {
		return userOrganizations?.find((org) => org.active) ?? null
	}, [userOrganizations])

	return (
		<ClineAuthContext.Provider
			value={{
				clineUser: user,
				organizations: userOrganizations,
				activeOrganization,
			}}>
			{children}
		</ClineAuthContext.Provider>
	)
}

export const useClineAuth = () => {
	const context = useContext(ClineAuthContext)
	if (context === undefined) {
		throw new Error("useClineAuth must be used within a ClineAuthProvider")
	}
	return context
}

export const useClineSignIn = () => {
	const handleSignIn = () => {
		console.log("Sign in not available")
	}

	return {
		isLoginLoading: false,
		handleSignIn,
	}
}

export const handleSignOut = async () => {
	console.log("Sign out not available")
}
