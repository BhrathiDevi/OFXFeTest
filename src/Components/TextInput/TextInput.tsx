import React from "react";
import classes from "./TextInput.module.css";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  placeholder = "Enter amount",
}) => {
  return (
    <div className={classes.container}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={classes.input}
      />
    </div>
  );
};

export default TextInput;
