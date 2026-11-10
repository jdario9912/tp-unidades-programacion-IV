import { useState } from "react";
import { esUrlValida } from "@/shared/utils/url";

type Props = {
  url: string;
};

const ImagenPreview = ({ url }: Props) => {
  const [error, setError] = useState(false);
  const valida = esUrlValida(url.trim());

  return (
    <div className="size-12 shrink-0 flex items-center justify-center rounded border border-divider bg-placeholder overflow-hidden text-[10px] text-muted text-center">
      {!valida ? (
        "Sin imagen"
      ) : error ? (
        "Error"
      ) : (
        <img
          src={url.trim()}
          alt="Vista previa"
          className="size-full object-cover"
          onError={() => setError(true)}
        />
      )}
    </div>
  );
};

export default ImagenPreview;
