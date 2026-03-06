import AuthForm from "../components/AuthForm";

export default function RegisterPage({ onLogin, onSwitch }) {
  return <AuthForm mode="register" onLogin={onLogin} onSwitch={onSwitch} />;
}
