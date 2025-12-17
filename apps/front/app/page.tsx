import GlobeComponent from "@/components/Globe";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="max-w-7xl mx-auto flex items-center justify-evenly px-4 py-5">
      <div className="max-w-6xl w-full grid grid-cols-2 gap-16 items-center">
        {/* Left Column - Text */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
            Build Your Dream with{" "}
            <span className="text-indigo-600">DreamWay</span>
          </h1>
          <p className="text-lg text-gray-600">
            We help you design and achieve your goals with the best tools and
            guidance. Let’s take the first step together today.
          </p>
          <div className="flex gap-4">
            <Button className="px-6 py-3 rounded bg-indigo-600 hover:bg-indigo-700 text-white">
              Get Started
            </Button>
            <Button variant="outline" className="px-6 py-3 rounded">
              Learn More
            </Button>
          </div>
        </div>

        <div className="flex justify-center md:justify-end w-full max-w-md rounded-2xl">
          <GlobeComponent />
        </div>
      </div>
    </section>
  );
}
