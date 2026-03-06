import AuthForm from "../components/AuthForm";

export default function LoginPage({ onLogin, onSwitch }) {
  return <AuthForm mode="login" onLogin={onLogin} onSwitch={onSwitch} />;
}
