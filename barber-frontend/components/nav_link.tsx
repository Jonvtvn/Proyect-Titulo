import Link from "next/link";

interface navitemProps {
    text: string;
    href: string;
    active: boolean;
}

const navitem: React.FC<navitemProps> = ({ text, href, active }) => {
    return (
        <Link legacyBehavior href={href}>
            <a className={`text-white bg-gradient-to-r hover:from-red-600 hover:to-red-600 inline-block hover:text-transparent bg-clip-text rounded-md text-sm font-medium `}>
                {text}
            </a>
        </Link>
    );
};

export default navitem;
