
const SvgIcon = ({ id, ...props }) => (
    <svg {...props}>
        <use href={`#${id}`} />
    </svg>
);

export default SvgIcon