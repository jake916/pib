"use client";

import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

interface StatCounterProps {
    value: number;
    label: string;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    color?: string;
}

export default function StatCounter({
    value,
    label,
    prefix = "",
    suffix = "",
    decimals = 0,
    color = "var(--pib-black)"
}: StatCounterProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
    const displayValue = useTransform(spring, (current) =>
        current.toFixed(decimals)
    );

    useEffect(() => {
        if (isInView) {
            spring.set(value);
        }
    }, [isInView, value, spring]);

    return (
        <div ref={ref} className="stat-item">
            <span className="stat-label">{label}</span>
            <motion.span
                className="stat-number"
                style={{ color }}
            >
                {prefix}
                <motion.span>{displayValue}</motion.span>
                {suffix}
            </motion.span>
        </div>
    );
}
