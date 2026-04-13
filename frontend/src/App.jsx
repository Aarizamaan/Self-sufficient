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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-indigo-50 flex flex-col p-4 md:p-8 font-sans transition-all">
      <div className="max-w-5xl w-full mx-auto space-y-6 md:space-y-8">
        
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 mb-2">Leave Record Editor</h1>
          <p className="text-gray-500">Edit and generate realistic hostel leave records dynamically.</p>
        </div>

        {/* Editor Form */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b border-gray-100 pb-3">Record Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-1 group-hover:text-blue-600 transition-colors">Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 outline-none transition-all shadow-sm" />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-1 group-hover:text-blue-600 transition-colors">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 outline-none transition-all shadow-sm" />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-1 group-hover:text-blue-600 transition-colors">UID</label>
              <input type="text" name="uid" value={formData.uid} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 outline-none transition-all shadow-sm" />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-1 group-hover:text-blue-600 transition-colors">Leave Type</label>
              <select name="leaveType" value={formData.leaveType} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 outline-none transition-all shadow-sm appearance-none cursor-pointer">
                <option value="Day Out">Day Out</option>
                <option value="Night Out">Night Out</option>
              </select>
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-1 group-hover:text-blue-600 transition-colors">Reason</label>
              <input type="text" name="reason" value={formData.reason} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 outline-none transition-all shadow-sm" />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-1 group-hover:text-blue-600 transition-colors">Status Message</label>
              <input type="text" name="statusMessage" value={formData.statusMessage} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 outline-none transition-all shadow-sm" />
            </div>
          </div>
          
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={handleReset} className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 rounded-lg transition-all font-medium shadow-sm hover:shadow active:scale-95">Reset Fields</button>
          </div>
        </div>

        {/* Live Preview UI */}
        <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Live Preview</h2>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button onClick={handleCopyText} className="flex-1 sm:flex-none px-4 py-2 text-sm bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-all font-medium border border-indigo-100 hover:border-indigo-200 active:scale-95">Copy Text</button>
              <button onClick={handleDownloadImage} className="flex-1 sm:flex-none px-4 py-2 text-sm bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-all font-medium border border-emerald-100 hover:border-emerald-200 active:scale-95">Download Image</button>
              <button onClick={handleSave} className="flex-1 sm:flex-none px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all font-medium shadow-md hover:shadow-lg active:scale-95">Save Locally</button>
            </div>
          </div>
          
          <div className="mb-2 text-xs text-gray-400 sm:hidden">Swipe right to view full table &rarr;</div>

          {/* IMPORTANT: This table closely mimics the exact snippet in the image. */}
          <div className="border border-[#e5e7eb] inline-block min-w-full bg-white">
            <table className="w-full text-left border-collapse" ref={tableRowRef} style={{ tableLayout: 'auto' }}>
              <thead className="bg-[#f0f0f0]">
                <tr className="border-b border-[#e5e7eb]">
                  <th className="p-2.5 border-r border-[#e5e7eb] text-[#111] font-bold text-[14px] whitespace-nowrap">Applied on</th>
                  <th className="p-2.5 border-r border-[#e5e7eb] text-[#111] font-bold text-[14px]">Name</th>
                  <th className="p-2.5 border-r border-[#e5e7eb] text-[#111] font-bold text-[14px]">Type</th>
                  <th className="p-2.5 border-r border-[#e5e7eb] text-[#111] font-bold text-[14px]">Purpose</th>
                  <th className="p-2.5 text-[#111] font-bold text-[14px]">Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr className="group hover:bg-gray-50/50 transition-colors">
                  <td className="p-2.5 border-r border-[#e5e7eb] align-top text-[#333] text-[13px] whitespace-nowrap">
                    {formatDisplayDate(formData.date)}
                  </td>
                  <td className="p-2.5 border-r border-[#e5e7eb] align-top text-[#333] text-[13px] whitespace-nowrap max-w-[300px]">
                    {formData.name}({formData.uid})
                  </td>
                  <td className="p-2.5 border-r border-[#e5e7eb] align-top text-[#333] text-[13px] whitespace-nowrap">
                    {formData.leaveType}
                  </td>
                  <td className="p-2.5 border-r border-[#e5e7eb] align-top text-[#333] text-[13px]">
                    {formData.reason}
                  </td>
                  <td className="p-2.5 align-top">
                    <span className="text-[#1d4ed8] hover:text-[#1e40af] cursor-pointer text-[13px] font-medium">
                      {formData.statusMessage}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Saved Records Table */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-semibold text-gray-800">Saved Records</h2>
             <button onClick={fetchRecords} className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors border border-transparent hover:border-blue-100">Refresh</button>
          </div>
          {records.length === 0 ? (
            <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500 text-sm">No records saved yet. Fill out the form above to get started!</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse border border-[#e5e7eb]">
              <thead className="bg-[#f0f0f0]">
                <tr className="border-b border-[#e5e7eb]">
                  <th className="p-2.5 border-r border-[#e5e7eb] text-[#111] font-bold text-[14px] whitespace-nowrap">Applied on</th>
                  <th className="p-2.5 border-r border-[#e5e7eb] text-[#111] font-bold text-[14px]">Name</th>
                  <th className="p-2.5 border-r border-[#e5e7eb] text-[#111] font-bold text-[14px]">Type</th>
                  <th className="p-2.5 border-r border-[#e5e7eb] text-[#111] font-bold text-[14px]">Purpose</th>
                  <th className="p-2.5 text-[#111] font-bold text-[14px]">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {records.map(record => (
                  <tr key={record.id} className="border-b border-[#e5e7eb] hover:bg-gray-50/50">
                    <td className="p-2.5 border-r border-[#e5e7eb] align-top text-[#333] text-[13px] whitespace-nowrap">{formatDisplayDate(record.date)}</td>
                    <td className="p-2.5 border-r border-[#e5e7eb] align-top text-[#333] text-[13px] whitespace-nowrap">{record.name}({record.uid})</td>
                    <td className="p-2.5 border-r border-[#e5e7eb] align-top text-[#333] text-[13px] whitespace-nowrap">{record.leaveType}</td>
                    <td className="p-2.5 border-r border-[#e5e7eb] align-top text-[#333] text-[13px]">{record.reason}</td>
                    <td className="p-2.5 align-top text-[13px]"><span className="text-[#1d4ed8] font-medium">{record.statusMessage}</span></td>
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
