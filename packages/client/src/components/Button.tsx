import "./NavButton.scss"
import { getSrc } from "../utils/utils"
import React from "react";

type ButtonProps = {
    children: React.ReactNode,
    disabled?: boolean,
    isLoading?: boolean
}

const Button: React.FC<ButtonProps> = ({ children, disabled = false, isLoading = false }) => {
    const buttonClass = disabled ? 'button-default button-disabled' : 'button-default';
    return <div className={buttonClass}>
        {isLoading ? <div className={"loading-box"}><img className={"load-img"} src={getSrc('layout/loading.png')} alt=""/></div> : children}
    </div>;
};

export default Button;