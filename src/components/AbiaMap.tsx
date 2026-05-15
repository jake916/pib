"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Props {
    geoData: any;
    onLgaSelect: (lga: string) => void;
    selectedLga: string | null;
}

const AbiaMap: React.FC<Props> = ({ geoData, onLgaSelect, selectedLga }) => {
    // Bounds from previous check
    const bounds = {
        minX: 6.886972904205322,
        maxX: 7.96204519271862,
        minY: 4.990295886993465,
        maxY: 5.869999885559082
    };

    const width = 800;
    const height = 800;
    const padding = 60;

    const project = (lon: number, lat: number) => {
        const x = ((lon - bounds.minX) / (bounds.maxX - bounds.minX)) * (width - 2 * padding) + padding;
        const y = (height - padding) - ((lat - bounds.minY) / (bounds.maxY - bounds.minY)) * (height - 2 * padding);
        return [x, y];
    };

    // Professional color palette for regions
    const regionColors = [
        '#E0F2FE', // Light Blue
        '#DCFCE7', // Light Green
        '#FEF3C7', // Light Yellow
        '#F3E8FF', // Light Purple
        '#FFEDD5', // Light Orange
        '#FCE7F3', // Light Pink
        '#E2E8F0', // Light Slate
        '#CCFBF1', // Light Teal
        '#DBEAFE', // Blue 100
        '#EDE9FE', // Violet 100
    ];

    const mapFeatures = useMemo(() => {
        return geoData.features.map((feature: any, index: number) => {
            const lgaName = feature.properties.lga;
            const coords = feature.geometry.coordinates;
            const type = feature.geometry.type;
            
            let path = '';
            let allProjectedPoints: [number, number][] = [];

            if (type === 'Polygon') {
                path = coords.map((ring: any[]) => {
                    const points = ring.map((coord: number[]) => {
                        const p = project(coord[0], coord[1]);
                        allProjectedPoints.push(p as [number, number]);
                        return p;
                    });
                    return `M ${points.map(p => p.join(',')).join(' L ')} Z`;
                }).join(' ');
            } else if (type === 'MultiPolygon') {
                path = coords.map((polygon: any[][]) => {
                    return polygon.map((ring: any[]) => {
                        const points = ring.map((coord: number[]) => {
                            const p = project(coord[0], coord[1]);
                            allProjectedPoints.push(p as [number, number]);
                            return p;
                        });
                        return `M ${points.map(p => p.join(',')).join(' L ')} Z`;
                    }).join(' ');
                }).join(' ');
            }

            let labelPos = [0, 0];
            if (allProjectedPoints.length > 0) {
                const sumX = allProjectedPoints.reduce((sum, p) => sum + p[0], 0);
                const sumY = allProjectedPoints.reduce((sum, p) => sum + p[1], 0);
                labelPos = [sumX / allProjectedPoints.length, sumY / allProjectedPoints.length];
            }

            return {
                name: lgaName,
                path,
                labelPos,
                defaultColor: regionColors[index % regionColors.length]
            };
        });
    }, [geoData]);

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto"
            style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}
        >
            <g>
                {mapFeatures.map((feature: any) => {
                    const isSelected = selectedLga === feature.name;

                    return (
                        <g key={feature.name}>
                            <motion.path
                                d={feature.path}
                                initial={{ fill: feature.defaultColor, stroke: '#CBD5E1' }}
                                animate={{
                                    fill: isSelected ? '#D72638' : feature.defaultColor,
                                    stroke: isSelected ? '#D72638' : '#94A3B8',
                                    scale: isSelected ? 1.02 : 1,
                                    transition: { duration: 0.3 }
                                }}
                                whileHover={{
                                    fill: isSelected ? '#D72638' : '#CBD5E1', // Slightly darker on hover if not selected
                                    stroke: '#D72638',
                                    cursor: 'pointer'
                                }}
                                onClick={() => onLgaSelect(feature.name)}
                                strokeWidth={isSelected ? 2 : 1}
                                strokeLinejoin="round"
                            />
                            <text
                                x={feature.labelPos[0]}
                                y={feature.labelPos[1]}
                                textAnchor="middle"
                                pointerEvents="none"
                                style={{
                                    fontSize: '11px',
                                    fontWeight: isSelected ? '700' : '600',
                                    fill: isSelected ? '#FFFFFF' : '#334155',
                                    textShadow: isSelected ? 'none' : '0 0 2px rgba(255,255,255,0.8)',
                                    transition: 'all 0.3s ease',
                                    userSelect: 'none'
                                }}
                            >
                                {feature.name}
                            </text>
                        </g>
                    );
                })}
            </g>
        </svg>
    );
};

export default AbiaMap;
