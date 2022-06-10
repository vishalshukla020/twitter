import React from "react";

interface Props {
  text: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  active?: boolean;
}

const Sidebar: React.FC<Props> = ({ Icon, text, active }) => {
  return (
    <div
      className={`text-[#d9d9d9] flex items-center justify-center xl:justify-start text-xl space-x-3 hover-animation ${
        active && "font-bold"
      }`}
    >
      <Icon className="h-7 text-white" />
      <span className="hidden xl:inline">{text}</span>
    </div>
  );
};

export default Sidebar;
