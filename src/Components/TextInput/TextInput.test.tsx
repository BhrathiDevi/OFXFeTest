import { render, screen, fireEvent } from "@testing-library/react";
import TextInput from "./TextInput";
import React from "react";


jest.mock("./TextInput.module.css", () => ({
    container: "container-class",
    input: "input-class",
}));

describe("TextInput Component", () => {
    it("renders correctly", () => {
        render(<TextInput value="" onChange={() => {}} />);
        const inputElement = screen.getByPlaceholderText("Enter amount");
        expect(inputElement).toBeInTheDocument();
    });

    it("displays the correct value", () => {
        render(<TextInput value="Test Value" onChange={() => {}} />);
        const inputElement = screen.getByDisplayValue("Test Value");
        expect(inputElement).toBeInTheDocument();
    });

    it("calls onChange when input value changes", () => {
        const handleChange = jest.fn();
        render(<TextInput value="" onChange={handleChange} />);
        const inputElement = screen.getByPlaceholderText("Enter amount");

        fireEvent.change(inputElement, { target: { value: "123" } });
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith("123");
    });

    it("applies the correct CSS classes", () => {
        const { container } = render(<TextInput value="" onChange={() => {}} />);
        const inputElement = container.querySelector(".input-class");
        expect(inputElement).toBeInTheDocument();
    });
});