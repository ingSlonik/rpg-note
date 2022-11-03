import { CSSProperties, ReactNode, useState, createElement } from "react";
import Icon from '@mdi/react';

import { colors } from "./colors";

type FlexProps = {
    tag?: string,
    style?: CSSProperties,
    grow?: number,
    basis?: number,
    row?: boolean,
    align?: "normal" | "stretch" | "center" | "end" | "flex-end" | "flex-start" | "self-end" | "self-start" | "start",
    justify?: "stretch" | "space-around" | "space-between" | "space-evenly" | "center" | "end" | "flex-end" | "flex-start" | "start" | "normal",
    children: ReactNode
};

export function Flex({ tag = "div", style, grow, basis, row, align, justify, children, ...divAttr }: FlexProps & React.HTMLAttributes<HTMLDivElement>) {
    return createElement(tag, {
        ...divAttr,
        style: {
            display: "flex",
            flexDirection: row ? "row" : "column",
            alignItems: align,
            justifyContent: justify,
            flexGrow: grow,
            flexBasis: basis ? `${basis}px` : undefined,
            ...style
        }
    }, children);
}

type ButtonProps = {
    active?: boolean,
    style?: CSSProperties,
    children: ReactNode,
    onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
};

export function Button({ active, style, children, onClick }: ButtonProps) {
    const [hover, setHover] = useState(false);
    return <div
        className="button"
        style={{
            fontSize: "18px",
            fontWeight: "bold",
            margin: "4px 16px",
            padding: "4px 16px",
            borderRadius: "4px",
            backgroundColor: (active || hover) ? colors.primaryDark : colors.primary,
            color: (active || hover) ? colors.textDark : colors.text,
            ...style,
        }}
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
    >
        {children}
    </div>;
}

type ButtonIconProps = {
    icon: string,
    text: string,
    active?: boolean,
    style?: CSSProperties,
    onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
};

export function ButtonIcon({ icon, text, active, style, onClick }: ButtonIconProps) {
    const [hover, setHover] = useState(false);

    return <Flex
        tag="a"
        row
        align="center"
        justify="center"
        className="button"
        style={{
            width: hover ? "142px" : "42px",
            height: "42px",
            borderRadius: "32px",
            backgroundColor: active || hover ? colors.primaryDark : colors.primary,
            color: active || hover ? colors.textDark : colors.text,
            ...style,
        }}
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
    >
        <Flex className="text" align="center" style={{ width: hover ? "100px" : "0px", overflow: "hidden" }}>{text}</Flex>
        <Icon path={icon} size={1} />
    </Flex >;
}