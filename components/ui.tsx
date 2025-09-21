import React from 'react';

// A helper for conditional class names
const cn = (...classes: (string | undefined | null | false)[]): string => 
    classes.filter(Boolean).join(' ');

// Button types
export type ButtonVariant = 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
}

// Button
export const Button: React.FC<ButtonProps> = ({ 
    children, 
    variant = 'default', 
    size = 'default', 
    className = '', 
    ...props 
}) => {
    const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variantClasses = {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-900",
        ghost: "hover:bg-gray-100 text-gray-900",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        link: "underline-offset-4 hover:underline text-blue-600"
    };
    
    const sizeClasses = {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md text-sm",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10"
    };

    return (
        <button 
            className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)} 
            {...props}
        >
            {children}
        </button>
    );
};

// Card types
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
    className?: string;
}

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
    className?: string;
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

// Card
export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => 
    <div className={cn('rounded-xl border bg-white text-gray-900 shadow-sm', className)} {...props}>{children}</div>;

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '', ...props }) => 
    <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>{children}</div>;

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '', ...props }) => 
    <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...props}>{children}</h3>;

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className = '', ...props }) => 
    <p className={cn('text-sm text-gray-500', className)} {...props}>{children}</p>;

export const CardContent: React.FC<CardContentProps> = ({ children, className = '', ...props }) => 
    <div className={cn('p-6 pt-0', className)} {...props}>{children}</div>;

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '', ...props }) => 
    <div className={cn('flex items-center p-6 pt-0', className)} {...props}>{children}</div>;

// Input types
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

// Label types
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode;
    className?: string;
}

// Progress types
export interface ProgressProps extends React.ProgressHTMLAttributes<HTMLProgressElement> {
    value: number;
    className?: string;
}

// Alert types
export type AlertVariant = 'default' | 'destructive' | 'warning';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: AlertVariant;
    className?: string;
}

export interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
    className?: string;
}

export interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
    className?: string;
}

// Badge types
export type BadgeVariant = 'default' | 'secondary' | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

// Textarea types
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string;
}

// Input
export const Input: React.FC<InputProps> = ({ className = '', ...props }) => 
    <input className={cn('flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', className)} {...props} />;

// Label
export const Label: React.FC<LabelProps> = ({ children, className = '', ...props }) => 
    <label className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)} {...props}>{children}</label>;

// Progress
export const Progress: React.FC<ProgressProps> = ({ value, className = '', ...props }) => 
    <progress value={value} max="100" className={cn('w-full h-2 bg-gray-200 rounded-full overflow-hidden', className)} {...props}>
        <div 
            className="h-full bg-blue-600 transition-all duration-300 ease-in-out" 
            style={{ width: `${value}%` }}
        />
    </progress>;

// Alert
export const Alert: React.FC<AlertProps> = ({ children, variant = 'default', className = '', ...props }) => {
    const variantClasses = {
        default: "bg-blue-50 text-blue-900 border-blue-200",
        destructive: "bg-red-50 text-red-900 border-red-200",
        warning: "bg-yellow-50 text-yellow-900 border-yellow-200"
    };
    
    return (
        <div 
            className={cn('relative w-full rounded-lg border p-4', variantClasses[variant], className)} 
            {...props}
        >
            {children}
        </div>
    );
};

export const AlertTitle: React.FC<AlertTitleProps> = ({ children, className = '', ...props }) => 
    <h4 className={cn('mb-1 font-semibold leading-none tracking-tight', className)} {...props}>{children}</h4>;

export const AlertDescription: React.FC<AlertDescriptionProps> = ({ children, className = '', ...props }) => 
    <div className={cn('text-sm', className)} {...props}>{children}</div>;

// Badge
export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '', ...props }) => {
    const variantClasses = {
        default: "bg-blue-600 text-white",
        secondary: "bg-gray-100 text-gray-800",
        outline: "border border-gray-300 bg-white text-gray-800"
    };
    
    return (
        <span 
            className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors', variantClasses[variant], className)} 
            {...props}
        >
            {children}
        </span>
    );
};

// Textarea
export const Textarea: React.FC<TextareaProps> = ({ className = '', ...props }) => 
    <textarea 
        className={cn(
            'flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
        )} 
        {...props} 
    />;

// Slider types
export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'defaultValue' | 'onValueChange'> {
    onValueChange?: (value: number[]) => void;
    defaultValue?: number[];
    className?: string;
}

// Slider
export const Slider: React.FC<SliderProps> = ({ onValueChange, className = '', ...props }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onValueChange) {
            onValueChange([parseInt(e.target.value, 10)]);
        }
    };
    
    const defaultValue = props.defaultValue ? props.defaultValue[0] : undefined;
    
    // Remove custom props from what's passed to the input element
    const { defaultValue: _, onValueChange: __, ...rest } = props;

    return (
        <input 
            type="range" 
            className={cn(
                'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600',
                '[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600',
                className
            )} 
            onChange={handleChange} 
            defaultValue={defaultValue} 
            {...rest} 
        />
    );
};
