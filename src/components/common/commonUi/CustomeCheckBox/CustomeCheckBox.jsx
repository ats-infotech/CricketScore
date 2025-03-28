import SvgIcon from '@/assets/icons/SvgIcon';
import './CustomeCheckBox.css';

const CustomeCheckBox = ({ title, checked, onChange }) => {
    return (
        <label className="container">{title}
            <input type="checkbox" checked={checked} onChange={onChange} />
             {/* <span className="checkmark" /> */}
            <span className="checkmark">{checked && <SvgIcon id="trueIcon" />}</span>
        </label>
    );
};

export default CustomeCheckBox;
