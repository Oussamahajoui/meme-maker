"use client";

import { Button } from "@/components/ui/button";
import { IKImage, IKUpload, ImageKitProvider } from "imagekitio-next";
import { useState } from "react";

const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
const authenticator = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/auth");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    } else {
      throw new Error(`Authentication request failed: ${String(error)}`);
    }
  }
};

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

export default function Home() {
  const [filePath, setFilePath] = useState("");
  return (
    <div>
      <Button variant={"destructive"}> CLICK MEEEE!</Button>
      <ImageKitProvider
        publicKey={publicKey}
        urlEndpoint={urlEndpoint}
        authenticator={authenticator}
      >
        {filePath && (
          <IKImage
            path={filePath}
            width={300}
            height={500}
            transformation={[{ raw: "l-text,i-hello world,fs-50,l-end" }]}
            alt="Alt text"
          />
        )}

        <h2>File upload</h2>
        <IKUpload
          fileName="test-upload.png"
          onError={(error) => {
            console.log("error", error);
          }}
          onSuccess={(response) => {
            console.log("success", response);
            setFilePath(response.filePath);
          }}
        />
      </ImageKitProvider>
    </div>
  );
}
