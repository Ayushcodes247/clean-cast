import { useEffect } from "react";
import axios from "axios";

export default function FacebookRedirect() {
  useEffect(() => {
    async function getData() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}auth/facebook/callback${
            window.location.search
          }`,
          { withCredentials: true }
        );

        console.log("FB redirect response:", res);

        const data = res.data;
        console.log("FB redirect data:", data);
        window.opener.postMessage(
          {
            token: data.token,
            user: data.user,
            expireyTime : data.expireyTime
          },
          "*"
        );

        window.close();
      } catch (err) {
        console.error("FB redirect error:", err);
      }
    }

    getData();
  }, []);

  return <div>Loading...</div>;
}
