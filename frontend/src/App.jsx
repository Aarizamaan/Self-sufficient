import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';

function App() {
  const [formData, setFormData] = useState({
    date: '2026-04-12', // Using YYYY-MM-DD for native date picker
    name: 'KUMAR SUBHAM RAJ',
    uid: '23BCS13045',
    leaveType: 'Day Out',
    reason: 'Going to shop',
    statusMessage: 'Your Leave is approved from Hostel Warden'
  });

  // Helper to format YYYY-MM-DD to "12 Apr 2026" style for display
  const formatDisplayDate = (isoString) => {
    if (!isoString) return '';
    const [year, month, day] = isoString.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`;
  };

  const [records, setRecords] = useState([]);
  const tableRowRef = useRef(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = () => {
    try {
      const storedRecords = localStorage.getItem('leaveRecords');
      if (storedRecords) {
        setRecords(JSON.parse(storedRecords));
      }
    } catch (error) {
      console.error('Error fetching records from local storage:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    try {
      const newRecord = { ...formData, id: Date.now() };
      const updatedRecords = [...records, newRecord];
      setRecords(updatedRecords);
      localStorage.setItem('leaveRecords', JSON.stringify(updatedRecords));
      alert('Record saved locally!');
    } catch (error) {
      console.error('Error saving record locally:', error);
      alert('Failed to save record.');
    }
  };

  const handleCopyText = () => {
    const displayDate = formatDisplayDate(formData.date);
    const textToCopy = `${displayDate} | ${formData.name}(${formData.uid}) | ${formData.leaveType} | ${formData.reason} | ${formData.statusMessage}`;
    navigator.clipboard.writeText(textToCopy);
    alert('Row text copied to clipboard!');
  };

  const handleDownloadImage = async () => {
    if (tableRowRef.current) {
      const canvas = await html2canvas(tableRowRef.current, { backgroundColor: '#ffffff' });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `leave-record-${formData.uid}.png`;
      link.click();
    }
  };

  const handleReset = () => {
    setFormData({
      date: '',
      name: '',
      uid: '',
      leaveType: 'Day Out',
      reason: 'Going to shop',
      statusMessage: 'Your Leave is approved from Hostel Warden'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-8 font-sans">
      <div className="max-w-5xl w-full mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Leave Record Editor</h1>
          <p className="text-gray-500">Edit and generate realistic hostel leave records dynamically.</p>
        </div>

        {/* Editor Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Record Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">UID</label>
              <input type="text" name="uid" value={formData.uid} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
              <select name="leaveType" value={formData.leaveType} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
                <option value="Day Out">Day Out</option>
                <option value="Night Out">Night Out</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <input type="text" name="reason" value={formData.reason} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status Message</label>
              <input type="text" name="statusMessage" value={formData.statusMessage} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={handleReset} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition font-medium">Reset</button>
            <div className="flex-1"></div>
          </div>
        </div>

        {/* Live Preview UI */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Live Preview</h2>
            <div className="flex gap-2">
              <button onClick={handleCopyText} className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded transition font-medium border border-indigo-200">Copy Text</button>
              <button onClick={handleDownloadImage} className="px-3 py-1.5 text-sm bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded transition font-medium border border-emerald-200">Download Image</button>
              <button onClick={handleSave} className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded transition font-medium shadow-sm">Save Locally</button>
            </div>
          </div>
          
          {/* IMPORTANT: This table closely mimics the exact snippet in the image. */}
          <div className="border border-[#e5e7eb] inline-block min-w-full bg-white">
            <table className="w-full text-left border-collapse" ref={tableRowRef} style={{ tableLayout: 'fixed' }}>
              <tbody>
                <tr className="border-b border-[#e5e7eb] group hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 border-r border-[#e5e7eb] align-top text-[#374151] w-[140px] font-medium text-[15px]">
                    {formatDisplayDate(formData.date)}
                  </td>
                  <td className="p-4 border-r border-[#e5e7eb] align-top text-[#374151] w-[220px]">
                    <div className="text-[15px]">{formData.name}</div>
                    <div className="text-[15px]">({formData.uid})</div>
                  </td>
                  <td className="p-4 border-r border-[#e5e7eb] align-top text-[#374151] w-[120px] text-[15px]">
                    {formData.leaveType}
                  </td>
                  <td className="p-4 border-r border-[#e5e7eb] align-top text-[#374151] w-[160px] text-[15px]">
                    {formData.reason}
                  </td>
                  <td className="p-4 align-top w-[350px]">
                    <span className="text-[#1d4ed8] hover:text-[#1e40af] cursor-pointer text-[15px]">
                      {formData.statusMessage}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Saved Records Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-semibold text-gray-800">Saved Records</h2>
             <button onClick={fetchRecords} className="text-sm text-blue-600 hover:underline">Refresh</button>
          </div>
          {records.length === 0 ? (
            <p className="text-gray-500 text-sm">No records saved yet.</p>
          ) : (
            <table className="w-full text-left border-collapse border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="p-3 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                  <th className="p-3 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="p-3 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">Reason</th>
                  <th className="p-3 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map(record => (
                  <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 text-sm text-gray-800">{formatDisplayDate(record.date)}</td>
                    <td className="p-3 text-sm text-gray-800">{record.name} ({record.uid})</td>
                    <td className="p-3 text-sm text-gray-800">{record.leaveType}</td>
                    <td className="p-3 text-sm text-gray-800">{record.reason}</td>
                    <td className="p-3 text-sm text-blue-600">{record.statusMessage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;
