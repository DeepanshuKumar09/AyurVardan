import React from 'react';

interface DonutChartProps {
    data: { name: string; value: number; color: string }[];
    size?: number;
    strokeWidth?: number;
    totalValue: number;
    totalLabel: string;
}

const DonutChart: React.FC<DonutChartProps> = ({
    data,
    size = 220,
    strokeWidth = 35,
    totalValue,
    totalLabel,
}) => {
    const halfSize = size / 2;
    const radius = halfSize - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    let accumulatedPercentage = 0;

    return (
        <div className="relative flex items-center justify-center mx-auto" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                {data.map((item, index) => {
                    const strokeDasharray = `${(item.value / 100) * circumference} ${circumference}`;
                    const rotation = accumulatedPercentage * 3.6;
                    accumulatedPercentage += item.value;
                    
                    return (
                        <circle
                            key={index}
                            cx={halfSize}
                            cy={halfSize}
                            r={radius}
                            stroke={item.color}
                            strokeWidth={strokeWidth}
                            fill="transparent"
                            strokeDasharray={strokeDasharray}
                            strokeLinecap="round"
                            style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '50% 50%' }}
                        />
                    );
                })}
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-bold text-slate-800">{totalValue}</span>
                <span className="text-sm text-slate-500">{totalLabel}</span>
            </div>
        </div>
    );
};

export default DonutChart;
