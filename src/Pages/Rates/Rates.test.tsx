import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import Rates from ".";
const mockFunction = jest.fn();
describe("Rates Component", () => {
  global.fetch = mockFunction;
  beforeEach(() => {
    global.fetch = mockFunction;
    mockFunction.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Headers(),
        json: () => Promise.resolve({ retailRate: 0.645 }),
        text: () => Promise.resolve(""),
      } as Response)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it("renders the Rates component", () => {
    render(<Rates />);
    expect(screen.getByText("Currency Conversion")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter amount to convert")
    ).toBeInTheDocument();
  });

  it("allows the user to enter an amount", () => {
    render(<Rates />);
    const input = screen.getByPlaceholderText("Enter amount to convert");
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "100" } });
    expect(input).toHaveValue("100");
  });

  it("fetches and displays the exchange rate when both currencies are selected", async () => {
    const { container } = render(<Rates />);

    const fromDropdownButton = screen
      .getByText("From")
      ?.closest("div")
      ?.querySelector("button");

    expect(fromDropdownButton).toBeInTheDocument();

    if (fromDropdownButton) {
      fireEvent.click(fromDropdownButton);
    }

    const fromMenu = container.querySelectorAll("ul")[0];
    expect(fromMenu).toBeInTheDocument();

    if (fromMenu) {
      const fromOption = within(fromMenu).getByText("AUD");
      fireEvent.click(fromOption);
    }

    const toDropdownButton = screen
      .getByText("To")
      ?.closest("div")
      ?.querySelector("button");
    if (toDropdownButton) fireEvent.click(toDropdownButton);
    const toMenu = container.querySelector("ul");
    expect(toMenu).toBeInTheDocument();
    if (toMenu) {
      const toOption = within(toMenu).getByText("USD");
      fireEvent.click(toOption);
    }

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "https://rates.staging.api.paytron.com/rate/public?sellCurrency=AUD&buyCurrency=USD"
      );
    });
    await waitFor(() => {
      expect(screen.getByText("0.645")).toBeInTheDocument();
    });
  });

  it("displays an error message when the API call fails", async () => {
    mockFunction.mockImplementation(() =>
      Promise.resolve({
        ok: false,
        json: () =>
          Promise.resolve({
            detail:
              "We could not determine an FX rate for AUD/USD. Please try again later or contact us if the issue persists.",
          }),
      })
    );
    const { container } = render(<Rates />);

    const fromDropdownButton = screen
      .getByText("From")
      ?.closest("div")
      ?.querySelector("button");

    if (fromDropdownButton) {
      fireEvent.click(fromDropdownButton);
    }

    const fromMenu = container.querySelector("ul");
    expect(fromMenu).toBeInTheDocument();

    if (fromMenu) {
      const fromOption = within(fromMenu).getByText("AUD");
      fireEvent.click(fromOption);
    }

    const toDropdownButton = screen
      .getByText("To")
      ?.closest("div")
      ?.querySelector("button");
    if (toDropdownButton) fireEvent.click(toDropdownButton);
    const toMenu = container.querySelector("ul");
    expect(toMenu).toBeInTheDocument();
    if (toMenu) {
      const toOption = within(toMenu).getByText("USD");
      fireEvent.click(toOption);
    }

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "https://rates.staging.api.paytron.com/rate/public?sellCurrency=AUD&buyCurrency=USD"
      );
    });
    await waitFor(() => {
      expect(
        screen.getByText(
          "Error: We could not determine an FX rate for AUD/USD. Please try again later or contact us if the issue persists."
        )
      ).toBeInTheDocument();
    });
  });
  it("calculates and displays the true amount and marked-up amount", async () => {
    const { container } = render(<Rates />);

    const fromDropdownButton = screen
      .getByText("From")
      ?.closest("div")
      ?.querySelector("button");

    if (fromDropdownButton) {
      fireEvent.click(fromDropdownButton);
    }

    const fromMenu = container.querySelector("ul");
    expect(fromMenu).toBeInTheDocument();

    if (fromMenu) {
      const fromOption = within(fromMenu).getByText("AUD");
      fireEvent.click(fromOption);
    }

    const toDropdownButton = screen
      .getByText("To")
      ?.closest("div")
      ?.querySelector("button");
    if (toDropdownButton) fireEvent.click(toDropdownButton);
    const toMenu = container.querySelector("ul");
    expect(toMenu).toBeInTheDocument();
    if (toMenu) {
      const toOption = within(toMenu).getByText("USD");
      fireEvent.click(toOption);
    }

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "https://rates.staging.api.paytron.com/rate/public?sellCurrency=AUD&buyCurrency=USD"
      );
    });

    const input = screen.getByPlaceholderText("Enter amount to convert");
    fireEvent.change(input, { target: { value: "100" } });

    expect(screen.getByText("True Amount (No Markup):")).toBeInTheDocument();
    expect(screen.getByText("64.50 USD")).toBeInTheDocument();
    expect(
      screen.getByText("Marked Up Amount (0.5% Markup):")
    ).toBeInTheDocument();
    expect(screen.getByText("64.18 USD")).toBeInTheDocument();
  });

  it("stops the progress bar and refetch data when it completes", async () => {
    jest.useFakeTimers();

    const { container } = render(<Rates />);

    const fromDropdownButton = screen
      .getByText("From")
      ?.closest("div")
      ?.querySelector("button");

    if (fromDropdownButton) {
      fireEvent.click(fromDropdownButton);
    }

    const fromMenu = container.querySelector("ul");
    expect(fromMenu).toBeInTheDocument();

    if (fromMenu) {
      const fromOption = within(fromMenu).getByText("AUD");
      fireEvent.click(fromOption);
    }

    const toDropdownButton = screen
      .getByText("To")
      ?.closest("div")
      ?.querySelector("button");
    if (toDropdownButton) fireEvent.click(toDropdownButton);
    const toMenu = container.querySelector("ul");
    expect(toMenu).toBeInTheDocument();
    if (toMenu) {
      const toOption = within(toMenu).getByText("USD");
      fireEvent.click(toOption);
    }

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "https://rates.staging.api.paytron.com/rate/public?sellCurrency=AUD&buyCurrency=USD"
      );
    });
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});
