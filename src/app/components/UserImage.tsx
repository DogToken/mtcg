import React from "react";

interface UserImageProps {
  src?: string;
  alt?: string;
  size?: number; // default 48
  style?: React.CSSProperties;
}

export default function UserImage({ src, alt = "User", size = 48, style }: UserImageProps) {
  const [imgSrc, setImgSrc] = React.useState(src || "/profile.png");
  React.useEffect(() => {
    setImgSrc(src || "/profile.png");
  }, [src]);
  return (
    <img
      src={imgSrc}
      alt={alt}
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid #5eead4',
        boxShadow: '0 0 8px #00ffff',
        ...style,
      }}
      onError={() => setImgSrc("/profile.png")}
      loading="lazy"
    />
  );
} 