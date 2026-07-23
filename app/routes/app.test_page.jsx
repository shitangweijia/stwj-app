import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
    closestCenter,
} from "@dnd-kit/core";

import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

export default function TestPage() {
    const [visible, setVisible] = useState(true);

    // 表单字段
    const [fields, setFields] = useState([
        { id: "1", label: "姓名", required: false },
        { id: "2", label: "电话", required: false },
    ]);

    // 当前选中的字段
    const [selectedId, setSelectedId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    // 拖拽结束
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setFields((items) => {
            const oldIndex = items.findIndex((i) => i.id === active.id);
            const newIndex = items.findIndex((i) => i.id === over.id);
            return arrayMove(items, oldIndex, newIndex);
        });
    };

    // 新增字段
    const addField = (type) => {
        setFields([
            ...fields,
            {
                id: Date.now().toString(),
                label: type === "text" ? "新文本框" : "新数字框",
                required: false,
            },
        ]);
    };

    // 删除字段
    const removeField = (id) => {
        setFields((prev) => prev.filter((f) => f.id !== id));
        if (selectedId === id) setSelectedId(null);
    };

    // 更新字段属性
    const updateField = (id, patch) => {
        setFields((prev) =>
            prev.map((f) => (f.id === id ? { ...f, ...patch } : f))
        );
    };

    return (
        <s-page heading="组件测试页">
            {/* 横幅区域 */}
            <s-section heading="测试点击按钮打开横幅">
                {visible && (
                    <s-banner heading="通知" tone="success" dismissible hidden={!visible}>
                        这是一个横幅
                    </s-banner>
                )}
                <s-button onClick={() => setVisible((v) => !v)}>
                    {visible ? "关闭横幅" : "打开横幅"}
                </s-button>
            </s-section>

            {/* 表单构建器 */}
            <s-section heading="建立可以拖动的表单构建器">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <div style={{ display: "flex", gap: 16 }}>

                        {/* 左侧：字段列表 */}
                        <div style={{ width: 140 }}>
                            <s-button onClick={() => addField("text")}>文本框</s-button>
                            <br />
                            <s-button onClick={() => addField("number")}>数字框</s-button>
                        </div>

                        {/* 中间：画布 */}
                        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                            <div style={{ flex: 1 }}>
                                {fields.map((f) => (
                                    <SortableItem
                                        key={f.id}
                                        id={f.id}
                                        field={f}
                                        selected={f.id === selectedId}
                                        onSelect={() => setSelectedId(f.id)}
                                        onRemove={() => removeField(f.id)}
                                    >
                                        {f.label}
                                    </SortableItem>
                                ))}
                            </div>
                        </SortableContext>

                        {/* 右侧：属性面板 */}
                        <div style={{ width: 220, padding: 8, border: "1px solid #ddd" }}>
                            {selectedId ? (
                                <FieldPropertyPanel
                                    field={fields.find((f) => f.id === selectedId)}
                                    onChange={(patch) => updateField(selectedId, patch)}
                                />
                            ) : (
                                <p>请选择一个字段</p>
                            )}
                        </div>

                    </div>
                </DndContext>
            </s-section>
        </s-page>
    );
}

/* =======================
   可拖动字段行
======================= */
function SortableItem({ id, field, selected, onSelect, onRemove, children }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: "8px",
        marginBottom: "8px",
        border: selected ? "2px solid #2563eb" : "1px solid #ddd",
        background: selected ? "#eff6ff" : "#fff",
        cursor: "grab",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    };

    return (
        <div ref={setNodeRef} style={style} onClick={onSelect}>
            <span {...attributes} {...listeners}>
                ⠿ {children}
            </span>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
                style={{ cursor: "pointer" }}
            >
                🗑
            </button>
        </div>
    );
}

/* =======================
   右侧属性面板
======================= */
function FieldPropertyPanel({ field, onChange }) {
    return (
        <div>
            <p><strong>属性</strong></p>

            <label>标签名</label>
            <input
                value={field.label}
                onChange={(e) => onChange({ label: e.target.value })}
                style={{ width: "100%", marginBottom: 8 }}
            />

            <label>
                <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => onChange({ required: e.target.checked })}
                />
                必填
            </label>
        </div>
    );
}