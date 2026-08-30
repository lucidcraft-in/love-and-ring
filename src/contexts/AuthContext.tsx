import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getProfileStatus,
  getNextIncompleteStep,
  type UserProfile,
  type ProfileStatus,
} from "@/utils/profileStatus";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  profileStatus: ProfileStatus;
  nextIncompleteStep: number;
  login: (user: UserProfile) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export interface User {
  _id: string;
  email: string;
  fullName?: string;
  emailVerified?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem("user");

      if (savedUser && savedUser !== "undefined") {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem("user");
        }
      }
    };

    loadUser();

    window.addEventListener("userProfileUpdated", loadUser);
    return () => {
      window.removeEventListener("userProfileUpdated", loadUser);
    };
  }, []);

  const login = (userData: UserProfile) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("activeMatchesTab");
    localStorage.removeItem("activeUserDashboardTab");
    localStorage.removeItem("registration_draft");
    try {
      sessionStorage.clear();
    } catch (e) {
      console.error("Error clearing sessionStorage on logout:", e);
    }
    window.dispatchEvent(new Event("userProfileUpdated"));
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const profileStatus = getProfileStatus(user);
  const nextIncompleteStep = getNextIncompleteStep(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        profileStatus,
        nextIncompleteStep,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
