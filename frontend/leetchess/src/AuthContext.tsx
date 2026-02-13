import axios from "axios";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface User {
  name: string;
  email: string;
  pictureUrl: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // request now being done with authentication information
        axios.get('http://localhost:8082/user-info', {withCredentials: true})
        .then(response => {
            setUser(response.data);
        })
        .catch(() => {
            setUser(null);
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
        {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return useContext(AuthContext)
}
