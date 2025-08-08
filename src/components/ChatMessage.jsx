// /frontend/src/components/ChatMessage.jsx

import React from 'react';
import { Bot, User, BarChart2 } from 'lucide-react';
// CORRECTED: Added LineChart and Line to the import statement
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const renderChart = (msg) => {
    if (!msg.chartData || msg.chartData.length === 0) {
        return <p className="text-red-500">No data available for this chart.</p>;
    }

    switch (msg.chartType) {
        case 'pie':
            const pieDataKey = msg.dataKeys[0];
            return (
                 <PieChart width={400} height={300}>
                    <Pie
                        data={msg.chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey={pieDataKey}
                        nameKey="name"
                    >
                        {msg.chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => typeof value === 'number' ? value.toLocaleString() : value} />
                    <Legend />
                </PieChart>
            );
        case 'bar':
        case 'line':
        default:
            // Now LineChart is correctly defined
            const ChartComponent = msg.chartType === 'line' ? LineChart : BarChart;
            // Now Line is correctly defined
            const ChartElement = msg.chartType === 'line' ? Line : Bar;
            return (
                <ChartComponent
                    width={600}
                    height={350}
                    data={msg.chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value)} />
                    <Tooltip formatter={(value) => typeof value === 'number' ? value.toLocaleString() : value} />
                    <Legend />
                    {msg.dataKeys.map((key, index) => (
                        <ChartElement key={key} dataKey={key} fill={COLORS[index % COLORS.length]} />
                    ))}
                </ChartComponent>
            );
    }
};


const MessageContent = ({ msg }) => {
    switch (msg.type) {
        case 'chart':
            return (
                <div className="mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <BarChart2 size={20} />
                        Visualization
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{msg.text}</p>
                    <ResponsiveContainer width="100%" height={350}>
                        {renderChart(msg)}
                    </ResponsiveContainer>
                </div>
            );
        case 'error':
             return <p className="text-red-500">{msg.text}</p>;
        default:
            const parts = msg.text.split(/(```[\s\S]*?```)/);
            return (
                <div>
                    {parts.map((part, index) => {
                        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
                        if (match) {
                            const language = match[1] || 'bash';
                            const code = match[2];
                            return (
                                <div key={index} className="my-2 rounded-md overflow-hidden">
                                <SyntaxHighlighter language={language} style={oneDark} customStyle={{ margin: 0 }}>
                                    {code}
                                </SyntaxHighlighter>
                                </div>
                            );
                        }
                        return <p key={index} className="whitespace-pre-wrap">{part}</p>;
                    })}
                </div>
            );
    }
};

const ChatMessage = ({ msg }) => {
    const isBot = msg.sender === 'bot';
    const Icon = isBot ? Bot : User;

    return (
        <div className={`flex items-start gap-4 ${isBot ? '' : 'flex-row-reverse'}`}>
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isBot ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>
                <Icon size={24} />
            </div>
            <div className={`max-w-xl p-4 rounded-lg ${isBot ? 'bg-gray-100 dark:bg-gray-800' : 'bg-blue-100 dark:bg-blue-900'}`}>
                <MessageContent msg={msg} />
            </div>
        </div>
    );
};

ChatMessage.Loading = () => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-blue-500 text-white">
            <Bot size={24} />
        </div>
        <div className="max-w-xl p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
            <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
            </div>
        </div>
    </div>
);

export default ChatMessage;
