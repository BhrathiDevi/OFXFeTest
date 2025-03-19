import { render } from "@testing-library/react";
import ProgressBar from "./ProgressBar";
import React from "react";

jest.mock("./ProgressBar.module.css", () => ({
  base: "base-class",
  progress: "progress-class",
}));

describe("ProgressBar Component", () => {
  it("renders correctly", () => {
    const { container } = render(<ProgressBar progress={0.5} />);
    const progressBar = container.querySelector(".progress-class");
    expect(progressBar).toBeInTheDocument();
  });

  it("applies the provided animation class", () => {
    const { container } = render(
      <ProgressBar progress={0.7} animationClass="fade-in" />
    );
    const progressDiv = container.querySelector(".progress-class");
    expect(progressDiv).toHaveClass("fade-in");
  });

  it("renders with custom styles", () => {
    const customStyle = { backgroundColor: "red" };
    const { container } = render(
      <ProgressBar style={customStyle} progress={0.5} />
    );
    const baseDiv = container.querySelector(".base-class");
    expect(baseDiv).toHaveStyle(customStyle);
  });
});
