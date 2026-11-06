import React from 'react';

interface ContactButtonProps {
  onClick?: () => void;
  className?: string;
  label?: string;
  type?: 'button' | 'submit';
}

export const ContactButton: React.FC<ContactButtonProps> = ({
  onClick,
  className = '',
  label = '联系我',
  type = 'button',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-full text-white font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base cursor-pointer transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-white ${className}`}
      style={{
        background:
          'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow:
          '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
        outline: '2px solid #FFFFFF',
        outlineOffset: '-3px',
      }}
    >
      {label}
    </button>
  );
};

interface LiveProjectButtonProps {
  onClick?: () => void;
  className?: string;
  label?: string;
}

export const LiveProjectButton: React.FC<LiveProjectButtonProps> = ({
  onClick,
  className = '',
  label = '查看项目',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base hover:bg-[#D7E2EA]/10 transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-[#D7E2EA] ${className}`}
    >
      {label}
    </button>
  );
};
