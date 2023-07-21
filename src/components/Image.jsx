export default function Image({ src, ...rest }) {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  src = src && src.includes('https://') ? src : `${baseUrl}/uploads/${src}`;
  return <img {...rest} src={src} alt={''} />;
}

// export default function Image({src,...rest}) {
//   src = src && src.includes('https://')
//     ? src
//     : 'http://localhost:4000/uploads/'+src;
//   return (
//     <img {...rest} src={src} alt={''} />
//   );
// }
