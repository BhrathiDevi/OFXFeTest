import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DropDown from "./DropDown";

describe("DropDown Component", () => {
  let setSelected: jest.Mock;
  let setOpen: jest.Mock;

  beforeEach(() => {
    setSelected = jest.fn();
    setOpen = jest.fn();
  });

  const renderComponent = (open: boolean) => {
    render(
      <DropDown
        selected="USD"
        setSelected={setSelected}
        label="Currency"
        options={[
          { option: "USD", key: "usd" },
          { option: "EUR", key: "eur" },
        ]}
        leftIcon={<span></span>}
        open={open}
        setOpen={setOpen}
      />
    );
  };

  it("should render DropDown with a label", () => {
    renderComponent(false);
    expect(screen.getByText("Currency")).toBeInTheDocument();
  });

  it("should display selected option", () => {
    renderComponent(false);
    expect(screen.getByText("USD")).toBeInTheDocument();
  });

  it("should open dropdown when the button is clicked", () => {
    renderComponent(false);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(setOpen).toHaveBeenCalled();
  });

  it("should display the dropdown menu when open is true", () => {
    renderComponent(true);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("should toggle the dropdown when the button is clicked", () => {
    renderComponent(false);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(setOpen).toHaveBeenCalled();

    renderComponent(true);
    fireEvent.click(button);
    expect(setOpen).toHaveBeenCalled();
  });
});
