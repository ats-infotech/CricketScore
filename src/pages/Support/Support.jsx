import { Box, Link, Typography } from '@mui/material';
import './Support.css';
import { Call, Person, Place } from '@mui/icons-material';

const contactJson = [
  {
    title: 'Name',
    details: 'ATS Software Solution',
    redirect: 'https://atssoftwaresolution.com/',
  },
  {
    title: 'Number',
    details: '+91 97272 26776',
    redirect: 'tel:+919727226776',
  },
  {
    title: 'Address',
    details:
      'M-14- Agrasen Point Shopping center City light Rd ,Near Agrasen Bhavan , City Light town , Athwa Surat, Gujarat',
    redirect:
      'https://www.google.com/maps/place/Ats+Software+Solution/@21.163739,72.7919702,17z/data=!3m1!4b1!4m6!3m5!1s0x3be04dacedbe268b:0x59d18994a0dceeb8!8m2!3d21.163734!4d72.7945451!16s%2Fg%2F11n__vs1wb?entry=ttu&g_ep=EgoyMDI1MDcyMi4wIKXMDSoASAFQAw%3D%3D',
  },
];

const Support = () => {
  return (
    <Box className="support-section">
      <Typography variant="h6" className="support-title">
        Contact Us
      </Typography>
      <Box className='support_lineargradient'></Box>

      {contactJson?.length > 0 &&
        contactJson.map((item, i) => (
          <Link
            key={i}
            href={item.redirect}
            target="_blank"
            underline="none"
            className={`contact-item item-${i + 1}`}
            sx={{
                marginBlock: '15px'
            }}
          >
            <Box className="icon-box">
              {item.title === 'Name' ? (
                <Person fontSize="small" />
              ) : item.title === 'Number' ? (
                <Call fontSize="small" />
              ) : (
                <Place fontSize="small" />
              )}
            </Box>
            <Typography variant="body1" className="contact-text">
              {item.details}
            </Typography>
          </Link>
        ))}
    </Box>
  );
};

export default Support;
