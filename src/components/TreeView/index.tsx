"use client";

import React, { useState, useCallback, ReactNode } from "react";
import { ChevronRight, GripVertical } from "lucide-react";

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  icon?: ReactNode;
  badge?: ReactNode;
  actions?: ReactNode;
  disabled?: boolean;
  data?: unknown;
}

export interface TreeViewProps {
  nodes: TreeNode[];
  onSelect?: (node: TreeNode) => void;
  onExpand?: (nodeId: string, expanded: boolean) => void;
  onMove?: (nodeId: string, targetId: string, position: "before" | "after" | "inside") => void;
  renderNode?: (node: TreeNode, isSelected: boolean, isExpanded: boolean) => ReactNode;
  selectedId?: string;
  defaultExpanded?: string[];
  draggable?: boolean;
  indentSize?: number;
  className?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

interface TreeItemProps {
  node: TreeNode;
  level: number;
  expanded: Set<string>;
  selectedId?: string;
  draggable?: boolean;
  indentSize: number;
  onSelect?: (node: TreeNode) => void;
  onToggle: (nodeId: string) => void;
  onMove?: TreeViewProps["onMove"];
  renderNode?: TreeViewProps["renderNode"];
  dragState: DragState;
  setDragState: React.Dispatch<React.SetStateAction<DragState>>;
}

interface DragState {
  draggingId: string | null;
  targetId: string | null;
  position: "before" | "after" | "inside" | null;
}

function TreeItem({
  node,
  level,
  expanded,
  selectedId,
  draggable,
  indentSize,
  onSelect,
  onToggle,
  onMove,
  renderNode,
  dragState,
  setDragState,
}: TreeItemProps) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expanded.has(node.id);
  const isSelected = selectedId === node.id;
  const isDragging = dragState.draggingId === node.id;
  const isDropTarget = dragState.targetId === node.id;

  const handleDragStart = (e: React.DragEvent) => {
    if (!draggable || node.disabled) return;
    e.dataTransfer.setData("text/plain", node.id);
    e.dataTransfer.effectAllowed = "move";
    setDragState((prev) => ({ ...prev, draggingId: node.id }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!draggable || !dragState.draggingId || dragState.draggingId === node.id) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;

    let position: "before" | "after" | "inside";
    if (y < height * 0.25) position = "before";
    else if (y > height * 0.75) position = "after";
    else position = "inside";

    setDragState((prev) => ({ ...prev, targetId: node.id, position }));
  };

  const handleDragLeave = () => {
    setDragState((prev) => {
      if (prev.targetId === node.id) return { ...prev, targetId: null, position: null };
      return prev;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (
      !draggable ||
      !dragState.draggingId ||
      !dragState.position ||
      dragState.draggingId === node.id
    )
      return;

    onMove?.(dragState.draggingId, node.id, dragState.position);
    setDragState({ draggingId: null, targetId: null, position: null });
  };

  const handleDragEnd = () => {
    setDragState({ draggingId: null, targetId: null, position: null });
  };

  return (
    <li role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined} aria-selected={isSelected}>
      <div
        className={cn(
          "group flex items-center gap-1 rounded-md px-2 py-1.5 transition-colors",
          isSelected
            ? "bg-[var(--dashboard-primary,#37a501)]/10 text-[var(--dashboard-primary,#37a501)]"
            : "hover:bg-[var(--dashboard-text-secondary,#6b7280)]/10 text-[var(--dashboard-text-primary,#2d2d2d)]",
          isDragging && "opacity-40",
          isDropTarget && dragState.position === "inside" && "ring-2 ring-[var(--dashboard-primary,#37a501)] ring-inset",
          node.disabled && "opacity-50 cursor-not-allowed",
        )}
        style={{ paddingLeft: `${level * indentSize + 4}px` }}
        draggable={draggable && !node.disabled}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
      >
        {isDropTarget && dragState.position === "before" && (
          <div className="absolute left-0 right-0 top-0 h-0.5 bg-[var(--dashboard-primary,#37a501)]" />
        )}
        {isDropTarget && dragState.position === "after" && (
          <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-[var(--dashboard-primary,#37a501)]" />
        )}

        {draggable && !node.disabled && (
          <span className="flex-shrink-0 opacity-0 group-hover:opacity-60 cursor-grab active:cursor-grabbing">
            <GripVertical className="h-3.5 w-3.5 text-[var(--dashboard-text-secondary,#6b7280)]" />
          </span>
        )}

        <button
          type="button"
          onClick={() => hasChildren && onToggle(node.id)}
          className={cn(
            "flex-shrink-0 w-5 h-5 flex items-center justify-center rounded transition-transform",
            hasChildren ? "cursor-pointer" : "invisible",
          )}
          tabIndex={hasChildren ? 0 : -1}
          aria-label={isExpanded ? "Recolher" : "Expandir"}
        >
          <ChevronRight
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-150",
              isExpanded && "rotate-90",
            )}
          />
        </button>

        {renderNode ? (
          <div
            className="flex-1 min-w-0 cursor-pointer"
            onClick={() => !node.disabled && onSelect?.(node)}
          >
            {renderNode(node, isSelected, isExpanded)}
          </div>
        ) : (
          <>
            {node.icon && (
              <span className="flex-shrink-0 h-4 w-4">{node.icon}</span>
            )}

            <span
              className={cn(
                "flex-1 min-w-0 text-sm truncate",
                !node.disabled && "cursor-pointer",
              )}
              onClick={() => !node.disabled && onSelect?.(node)}
            >
              {node.label}
            </span>

            {node.badge && <span className="flex-shrink-0">{node.badge}</span>}

            {node.actions && (
              <span className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {node.actions}
              </span>
            )}
          </>
        )}
      </div>

      {hasChildren && isExpanded && (
        <ul role="group" className="dashboard-animate-expand">
          {node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              expanded={expanded}
              selectedId={selectedId}
              draggable={draggable}
              indentSize={indentSize}
              onSelect={onSelect}
              onToggle={onToggle}
              onMove={onMove}
              renderNode={renderNode}
              dragState={dragState}
              setDragState={setDragState}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function TreeView({
  nodes,
  onSelect,
  onExpand,
  onMove,
  renderNode,
  selectedId,
  defaultExpanded = [],
  draggable = false,
  indentSize = 20,
  className,
}: TreeViewProps) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(defaultExpanded));
  const [dragState, setDragState] = useState<DragState>({
    draggingId: null,
    targetId: null,
    position: null,
  });

  const handleToggle = useCallback(
    (nodeId: string) => {
      setExpanded((prev) => {
        const next = new Set(prev);
        const willExpand = !next.has(nodeId);
        if (willExpand) next.add(nodeId);
        else next.delete(nodeId);
        onExpand?.(nodeId, willExpand);
        return next;
      });
    },
    [onExpand],
  );

  return (
    <ul role="tree" className={cn("select-none", className)}>
      {nodes.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          level={0}
          expanded={expanded}
          selectedId={selectedId}
          draggable={draggable}
          indentSize={indentSize}
          onSelect={onSelect}
          onToggle={handleToggle}
          onMove={onMove}
          renderNode={renderNode}
          dragState={dragState}
          setDragState={setDragState}
        />
      ))}
    </ul>
  );
}
