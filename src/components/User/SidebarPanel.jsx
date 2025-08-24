import { SketchPicker } from 'react-color'
import { useState } from 'react'
import DesignEditor from './DesignEditor'
import DesignLoader from './DesignLoader' // ✅ PNG export helper
import sampleDesign from './json/design.json'

// ✅ Designs


export default function SidebarPanel({
  selectedColor,
  setSelectedColor,
  selectedDesignURL,
  setSelectedDesignURL,
  selectedLayer,
  setSelectedLayer,
  setUserDesign,
  setSelectedDesignJSON,
}) {
  const [tab, setTab] = useState('Design')
  const [editorImage, setEditorImage] = useState(null)
  const [selectedJson, setSelectedJson] = useState(null)

  const designOptions = [
    { name: "Design 1", json: "/design/design1.json", preview: "/preview/preview1.png" },
    { name: "Design 2", json: "/design/design2.json", preview: "/preview/preview2.png" },
    { name: "Design 3", json: "/design/design3.json", preview: "/preview/preview3.png" },
    { name: "Design 3", json: "/design/design4.json", preview: "/preview/preview4.png" },

  ];

  // 🚀 Load design JSON
  const loadDesign = async (design) => {
    try {
      const res = await fetch(design.json);
      const jsonData = await res.json();

      setSelectedJson(jsonData);           // local
      setSelectedDesignJSON(jsonData);     // global → DesignLoader trigger
    } catch (err) {
      console.error("❌ Error loading design JSON:", err);
    }
  };
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Soccer Jersey F3 Basic</h1>

      {/* Tabs */}
      <div className="flex space-x-2 mb-4">
        {['Design', 'Colors', 'Text', 'Logos', 'Custom'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded ${
              tab === t ? 'bg-black text-white' : 'bg-gray-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* -------------------- Design Tab -------------------- */}
      {tab === "Design" && (
        <div className="grid grid-cols-4 gap-4">
          {designOptions.map((d, index) => (
            <div
              key={index}
              className="cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition:cover"
              onClick={() => loadDesign(d)}
            >
              <img
                src={d.preview}
                alt={d.name}
                className="w-full h-32 object-contain bg-gray-100"
              />
              <p className="text-center py-2 font-medium">{d.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* -------------------- Colors Tab -------------------- */}
      {tab === 'Colors' && selectedJson && (
        <div>
          {/* Dropdown → JSON objects count படி auto fill */}
          <select
            value={selectedLayer}
            onChange={(e) => setSelectedLayer(e.target.value)}
            className="border p-1 mb-4"
          >
            {selectedJson.objects.map((obj, index) => (
              <option key={index} value={index}>
                {obj.type} ({obj.fill})
              </option>
            ))}
          </select>

          {/* Color Picker */}
          <SketchPicker
            color={selectedColor}
            onChange={(color) => {
              setSelectedColor(color.hex)

              // 🔥 JSON clone செய்து அந்த Layer fill update பண்ணுதல்
              const updatedJson = { ...selectedJson }
              updatedJson.objects = [...updatedJson.objects]
              updatedJson.objects[selectedLayer] = {
                ...updatedJson.objects[selectedLayer],
                  fill: color.hex,   // ✅ புதிய நிறம்
                  stroke: null,      // ❌ border reset
                  shadow: null,      // ❌ shadow reset
                  opacity: 1,        // ✅ முழு நிறம்
                  fillRule: 'nonzero'
                }
              
              console.log("🎨 Layer", selectedLayer, "updated fill:", color.hex)

              setSelectedJson(updatedJson)          // local update
              setSelectedDesignJSON(updatedJson)    // global update → DesignLoader
            }}
          />
        </div>
      )}

      {/* -------------------- Custom Tab -------------------- */}
      {tab === 'Custom' && (
        <DesignEditor
          userImage={selectedDesignURL}
          editorImage={editorImage}
          setEditorImage={setEditorImage}
          setSelectedDesignURL={(finalImg) => {
            setSelectedDesignURL(finalImg)
            setUserDesign(finalImg)
          }}
        />
      )}
    </div>
  )
}
