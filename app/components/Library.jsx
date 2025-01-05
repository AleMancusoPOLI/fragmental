import { useEffect, useState } from "react";
import { db, storage } from "../firebase-config";
import { getDocs, collection } from "firebase/firestore";
import { getBlob, ref } from "firebase/storage";
import * as Tone from "tone"; // Import Tone.js

function Library({ onFileSelected }) {
  const [samples, setSamples] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null); // Store the current player instance

  useEffect(() => {
    const getSamples = async () => {
      try {
        const samplesData = await getDocs(collection(db, "samples"));
        const samplesArray = await Promise.all(
          samplesData.docs.map(async (doc) => {
            const data = doc.data();
            // Resolve gs:// URL and get the file as a blob
            if (data.url) {
              const storageRef = ref(storage, data.url);
              const blob = await getBlob(storageRef);
              data.url = URL.createObjectURL(blob); // Create a URL from the Blob
            }
            return { id: doc.id, ...data };
          })
        );
        setSamples(samplesArray);
      } catch (err) {
        console.error(err);
      }
    };
    getSamples();
  }, []);

  // Function to handle playback using Tone.js
  const playSample = (sampleUrl) => {
    // If there is a current player and it's playing, stop it
    if (!currentPlayer || !currentPlayer.loaded) {
      // Create a new Tone.Player and route to output
      const player = new Tone.Player(sampleUrl).toDestination();
      player.autostart = true; // Automatically start playback
      setCurrentPlayer(player); // Set the current player to the new player instance
    }
  };

  const stopSample = (sampleUrl) => {
    // If there is a current player and it's playing, stop it
    if (currentPlayer && currentPlayer.loaded) {
      currentPlayer.stop(); // Stop the previous sample if it's playing
      setCurrentPlayer(null); // Reset the current player state
    }
  };

  return (
    <div className="m-1 p-2 rounded border-2 border-solid">
      <p>Or choose a sample from our library:</p>
      <table className="w-full text-sm text-left rtl:text-right mt-2">
        <tbody>
          {samples.map((s, index) => (
            <tr
              key={s.id}
              className="bg-white border-b rounded hover:bg-gray-50"
            >
              <td className="font-bold text-black">{s.name}</td>
              <td className="text-gray-500">{s.description}</td>
              <td
                onClick={() => {
                  playSample(s.url);
                }}
                className="text-black cursor-pointer"
              >
                Play
              </td>
              <td
                onClick={() => {
                  stopSample();
                }}
                className="text-black cursor-pointer"
              >
                Stop
              </td>
              <td
                onClick={() => {
                  onFileSelected(s.url);
                }}
                className="text-blue-700 cursor-pointer"
              >
                Select
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Library;
