import React, { forwardRef } from "react";
import classes from "./DropDown.module.css";

interface Option {
  option: string;
  key: string;
  icon?: React.ReactNode;
}

interface DropDownProps {
  selected: string;
  setSelected: (key: string) => void;
  label?: string;
  options: Option[];
  leftIcon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  open: boolean;
  setOpen: () => void;
}

const DropDown = forwardRef<HTMLDivElement, DropDownProps>(
  (
    {
      selected,
      setSelected,
      label,
      options,
      leftIcon,
      className,
      style,
      open,
      setOpen,
    },
    ref
  ) => {
    const handleSelect = (key: string) => {
      setSelected(key);
      setOpen();
    };

    return (
      <div
        className={`${classes.container} ${className}`}
        style={style}
        data-testid="dropdown-container"
        ref={ref}
      >
        {label && <span>{label}</span>}
        <button onClick={setOpen} className={classes.dropdown}>
          {leftIcon}
          <span className={classes.dropdownText}>{selected}</span>
          <div className={classes.dropdownToggle}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.2 5.3894H7.8C6.2536 5.3894 5 6.64301 5 8.1894V16.5894C5 18.1358 6.2536 19.3894 7.8 19.3894H16.2C17.7464 19.3894 19 18.1358 19 16.5894V8.1894C19 6.64301 17.7464 5.3894 16.2 5.3894Z"
                stroke="#E5E5E5"
                strokeWidth="1.03427"
              />
              <path
                className={`${classes.toggleArrow} ${
                  open ? classes.toggled : ""
                }`}
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.20711 11.3894C8.76165 11.3894 8.53857 11.928 8.85355 12.243L11.6464 15.0359C11.8417 15.2311 12.1583 15.2311 12.3536 15.0358L15.1464 12.243C15.4614 11.928 15.2383 11.3894 14.7929 11.3894H9.20711Z"
                fill="#6D7587"
              />
            </svg>
          </div>
        </button>
        {open && (
          <ul className={classes.menu}>
            {options.map(({ option, key, icon }) => (
              <li className={classes["menu-item"]} key={label + key}>
                <button
                  className={classes.button}
                  onClick={() => handleSelect(key)}
                >
                  {icon}
                  {option}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

DropDown.displayName = "DropDown";

export default DropDown;
