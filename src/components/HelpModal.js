import React from 'react';

const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">About Inclined Surface Level Analyzer</h3>
          <div className="mt-2 px-7 py-3 text-left text-sm text-gray-500 overflow-y-auto max-h-96">
            <p className="mb-4">
              Inclined Surface Level Analyzer is a tool designed to analyze the vertical deviations of topographically measured points relative to a reference plane defined by SOP (System of Project Origin) points.
            </p>
            
            <h4 className="font-semibold mb-2">Main Features:</h4>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li><strong>Data Input:</strong> Paste SOP coordinates and topographic measurements directly from Excel. The program accepts numeric or text IDs.</li>
              <li><strong>Plane Calculation:</strong> Define a 3D reference plane using at least 3 SOP points.</li>
              <li><strong>Analysis of Deviations:</strong> Calculates the vertical distance (in millimeters) of each measured point to the SOP plane.</li>
              <li><strong>Table Visualization:</strong> Displays a detailed list of measured points, their coordinates, and the calculated deviation. The "Status" column has a background color based on tolerance. The table header remains fixed when scrolling. You can sort the table by any column by clicking its header.</li>
              <li><strong>Individual Deletion:</strong> Delete points individually from the table and graph by clicking the "Delete" button in the "Actions" column.</li>
              <li><strong>Averages:</strong> Calculates the average deviation and the absolute average deviation.</li>
              <li><strong>Tolerance Controls:</strong> Adjust upper and lower deviation limits to identify points outside tolerance. You can apply tolerance relative to the Average Deviation or the SOP Plane.</li> {/* Updated text */}
              <li><strong>Filters:</strong> Filter visible points in the table and graph based on their deviation status (Within, Above, Below, All).</li>
              <li><strong>Visualization Graph:</strong> Shows a 2D map (X, Y) with SOP points and measured points, colored according to their deviation status. SOP points are always displayed on the top layer with their ID and Z visible.</li>
              <li><strong>Graph-Table Interaction:</strong> Click a table row to highlight the corresponding point in the graph. The highlighted point is shown on a higher layer (below SOPs). Clicking a row centers the view on the graph.</li>
              <li><strong>Click Label on Graph:</strong> Click a point on the graph (SOP or measured) to show a persistent label next to it with its ID and coordinates (X, Y, Z). This label appears on a top layer and in multiline format.</li>
              <li><strong>SOP Drawing Tool:</strong> Activate drawing mode to create polylines connecting points SOP with a single click on each point. The polyline is interactively represented as you draw.</li>
              <li><strong>Automatic SOP Drawing:</strong> Automatically draws a closed polyline through all SOP points in the order they were entered.</li>
              <li><strong>Sorting:</strong> Sort the results table by the deviation column.</li>
              <li><strong>Export:</strong> Copy table data (respecting filters and sorting) to paste into Excel.</li>
              <li><strong>Simulation:</strong> Load a sample data set to quickly test the application.</li>
              <li><strong>Reset:</strong> Clear SOP data, measurements, or both to start over.</li>
            </ul>

            <h4 className="font-semibold mb-2">How to Use:</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Paste SOP coordinates into the first text box and click "Process Coordinates". Ensure you have at least 3 points to calculate the plane.</li>
              <li>Paste topographic measurements into the second text box and click "Process Measurements".</li>
              <li>Explore the table and graph to analyze deviations.</li>
              <li>Utilize the tolerance controls and filters to refine your analysis.</li>
              <li>Click table rows to highlight the point in the graph and center the view.</li>
              <li>Click points on the graph to show a label with their information.</li>
              <li>To delete a point individually, click the "Delete" button in the corresponding table row.</li>
              <li>To draw polylines between SOP points, click "Activate SOP Drawing", then click the first SOP point, and then consecutive SOP points to extend the polyline. Click a non-SOP point or "Deactivate Drawing" to finalize the current polyline. Click "Clear Drawings" to erase all polylines.</li>
              <li>Click "Automatic SOP Drawing" to trace a closed automatic polyline through all SOP points.</li>
              <li>Use the "Copy to Excel" button to export your results.</li>
              <li>Use the Reset or Simulation buttons as needed.</li>
            </ol>
          </div>

          <div className="items-center px-4 py-3">
            <button
              id="ok-btn"
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;

// DONE