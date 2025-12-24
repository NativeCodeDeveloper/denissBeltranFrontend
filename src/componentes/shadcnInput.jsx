"use client"

import {Input} from "@/components/ui/input";

export function ShadcnInput({
                                placeholder,
                                value,
                                onChange,
                                type = "text",
                                className = "",
                                ...props
                            }) {
    return (
        <Input
            type={type}
            placeholder={placeholder}
            value={value ?? ""}
            onChange={onChange}
            className={`border-blue-800 ${className}`}
            {...props}
        />
    );
}

export default ShadcnInput;
