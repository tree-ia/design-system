import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./index";
import React, { useState } from "react";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  argTypes: {
    compact: { control: "boolean" },
    showPageInfo: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    itemsPerPage: 10,
    totalItems: 95,
    onPageChange: () => {},
  },
};

export const WithItemsPerPage: Story = {
  args: {
    currentPage: 3,
    totalPages: 10,
    itemsPerPage: 10,
    totalItems: 95,
    onPageChange: () => {},
    onItemsPerPageChange: () => {},
  },
};

export const Compact: Story = {
  args: {
    currentPage: 5,
    totalPages: 20,
    itemsPerPage: 10,
    totalItems: 200,
    compact: true,
    onPageChange: () => {},
  },
};

export const Interactive: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const total = 95;
    return React.createElement(Pagination, {
      currentPage: page,
      totalPages: Math.ceil(total / perPage),
      itemsPerPage: perPage,
      totalItems: total,
      onPageChange: setPage,
      onItemsPerPageChange: setPerPage,
    });
  },
};
