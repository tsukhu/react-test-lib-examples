import * as React from "react";
import * as ReactDOM from "react-dom";
import { getQueriesForElement } from "@testing-library/dom";
import { render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { App } from "./App";
import { api } from "./api";

// Normally you can mock entire module using jest.mock('./api);
const mockCreateItem = (api.createItem = jest.fn());
const todoText = "Learn RTL";
mockCreateItem.mockResolvedValue({ id: 123, text: todoText });

const renderApp = (component) => {
  const root = document.createElement("div");
  ReactDOM.render(component, root);
  return getQueriesForElement(root);
};

describe("Testing Library Experiments", () => {
  test("renders the correct content (Without Testing Library)", () => {
    // Render a React Component to the DOM

    const root = document.createElement("div");

    ReactDOM.render(<App />, root);

    // Use DOM APIs (querySeletor) to make assertions.

    expect(root.querySelector("h1").textContent).toBe("TODOS");
    expect(root.querySelector("label").textContent).toBe(
      "What needs to be done?"
    );
    expect(root.querySelector("button").textContent).toBe("Add #1");
  });

  // Testing from the users perspective
  test("renders the correct content (Testing Library)", () => {
    // Render a React Component to the DOM
    const { getByText, getByLabelText } = renderApp(<App />);
    // Use DOM APIs (querySeletor) to make assertions.

    expect(getByText("TODOS")).not.toBeNull();
    expect(getByLabelText("What needs to be done?")).not.toBeNull();
    expect(getByText("Add #1")).not.toBeNull();
  });

  // No Need even for assertions
  test("renders the correct content (Testing Library): no assertions", () => {
    // Render a React Component to the DOM

    const { getByText, getByLabelText } = renderApp(<App />);
    // Use DOM APIs (querySeletor) to make assertions.

    expect(getByText("TODOS"));
    expect(getByLabelText("What needs to be done?"));
    expect(getByText("Add #1"));
  });

  test("allows users to add items to their list", async () => {
    const { getByText, getByLabelText } = render(<App />);
    const input = getByLabelText("What needs to be done?");

    fireEvent.change(input, {
      target: { value: todoText }
    });

    fireEvent.click(getByText("Add #1"));

    await (() => getByText(todoText));
    await (() => getByText("Add #2"));

    expect(mockCreateItem).toBeCalledWith(
      "/items",
      expect.objectContaining({ text: todoText })
    );
  });

  test("allows users to add items to their list with userEvent", async () => {
    const { getByText, getByLabelText } = render(<App />);

    const input = getByLabelText("What needs to be done?");

    userEvent.type(input, "Learn RTL");
    userEvent.click(getByText("Add #1"));

    await (() => getByText(todoText));
    await (() => getByText("Add #2"));
    expect(mockCreateItem).toBeCalledWith(
      "/items",
      expect.objectContaining({ text: todoText })
    );
  });
});
