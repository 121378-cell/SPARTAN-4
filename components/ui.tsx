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
    const sizeClass = size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : size === 'icon' ? 'icon' : 'default';
    return (
        <button className={cn('button', variant, sizeClass, className)} {...props}>
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
    <div className={cn('card', className)} {...props}>{children}</div>;

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '', ...props }) => 
    <div className={cn('card-header', className)} {...props}>{children}</div>;

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '', ...props }) => 
    <h3 className={cn('card-title', className)} {...props}>{children}</h3>;

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className = '', ...props }) => 
    <p className={cn('card-description', className)} {...props}>{children}</p>;

export const CardContent: React.FC<CardContentProps> = ({ children, className = '', ...props }) => 
    <div className={cn('card-content', className)} {...props}>{children}</div>;

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '', ...props }) => 
    <div className={cn('card-footer', className)} {...props}>{children}</div>;

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
    <input className={cn('input', className)} {...props} />;

// Label
export const Label: React.FC<LabelProps> = ({ children, className = '', ...props }) => 
    <label className={cn('label', className)} {...props}>{children}</label>;

// Progress
export const Progress: React.FC<ProgressProps> = ({ value, className = '', ...props }) => 
    <progress value={value} max="100" className={cn('progress', className)} {...props} />;

// Alert
export const Alert: React.FC<AlertProps> = ({ children, variant = 'default', className = '', ...props }) => 
    <div className={cn('alert', variant, className)} {...props} role="alert">{children}</div>;

export const AlertTitle: React.FC<AlertTitleProps> = ({ children, className = '', ...props }) => 
    <h4 className={cn('alert-title', className)} {...props}>{children}</h4>;

export const AlertDescription: React.FC<AlertDescriptionProps> = ({ children, className = '', ...props }) => 
    <p className={cn('alert-description', className)} {...props}>{children}</p>;

// Badge
export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '', ...props }) => 
    <span className={cn('badge', variant, className)} {...props}>{children}</span>;

// Textarea
export const Textarea: React.FC<TextareaProps> = ({ className = '', ...props }) => 
    <textarea className={cn('textarea', className)} {...props} />;

// Slider types
export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'defaultValue'> {
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

    return <input type="range" className={cn('slider', className)} onChange={handleChange} defaultValue={defaultValue} {...rest} />;
};
