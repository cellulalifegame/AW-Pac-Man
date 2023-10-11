import "./NavButton.scss"
import React from "react";
type ButtonProps = {
    children: React.ReactNode
}
const Button: React.FC<ButtonProps> = ({ children }) => {
    return <div className={children === 'Explore' ? "button-nav button-nav-active" : 'button-nav'}>{children}</div>;
};

export default Button;