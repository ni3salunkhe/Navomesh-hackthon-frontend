import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { documentAPI } from '../api/axios';
import toast from 'react-hot-toast';
import { HiOutlineCloudUpload, HiOutlineDocumentText, HiOutlineCheck, HiOutlineX } from 'react-icons/hi';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [result, setResult] = useState(null);

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        if (rejectedFiles.length > 0) {
            toast.error('Only PDF files under 10MB are allowed');
            return;
        }
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setUploadSuccess(false);
            setResult(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxSize: 10 * 1024 * 1024,
        multiple: false,
    });

    const handleUpload = async () => {
        if (!file) {
            toast.error('Please select a file first');
            return;
        }

        setUploading(true);
        try {
            const response = await documentAPI.upload(file);
            setUploadSuccess(true);
            setResult(response.data);
            toast.success('Document processed successfully! Transactions extracted.');
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || error.response?.data || error.message || 'Upload failed. Please try again.';
            toast.error(typeof message === 'string' ? message : 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const resetUpload = () => {
        setFile(null);
        setUploadSuccess(false);
        setResult(null);
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="page-header">Upload Document</h1>
                <p className="text-dark-500 dark:text-dark-400 mt-1">
                    Upload your bank statement PDF to extract and analyze transactions
                </p>
            </div>

            {/* Upload Area */}
            {!uploadSuccess ? (
                <div className="glass-card-solid p-8">
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${isDragActive
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
                            : file
                                ? 'border-accent-400 bg-accent-50 dark:bg-accent-900/10'
                                : 'border-dark-300 dark:border-dark-600 hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/5'
                            }`}
                    >
                        <input {...getInputProps()} id="file-upload-input" />

                        {file ? (
                            <div className="animate-fade-in">
                                <div className="w-16 h-16 bg-accent-100 dark:bg-accent-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <HiOutlineDocumentText className="text-accent-600 dark:text-accent-400" size={32} />
                                </div>
                                <p className="text-lg font-semibold text-dark-900 dark:text-white">{file.name}</p>
                                <p className="text-sm text-dark-400 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                <button
                                    onClick={(e) => { e.stopPropagation(); resetUpload(); }}
                                    className="mt-4 text-sm text-dark-400 hover:text-danger-500 transition-colors"
                                >
                                    Remove file
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <HiOutlineCloudUpload className="text-primary-600 dark:text-primary-400" size={32} />
                                </div>
                                <p className="text-lg font-semibold text-dark-900 dark:text-white">
                                    {isDragActive ? 'Drop your PDF here' : 'Drag & drop your PDF here'}
                                </p>
                                <p className="text-sm text-dark-400 mt-2">or click to browse files</p>
                                <p className="text-xs text-dark-300 dark:text-dark-500 mt-4">
                                    Supports PDF files up to 10MB • Bank statements only
                                </p>
                            </div>
                        )}
                    </div>

                    {file && (
                        <div className="mt-6 flex justify-center">
                            <button
                                id="upload-submit"
                                onClick={handleUpload}
                                disabled={uploading}
                                className="btn-primary flex items-center gap-2 px-10"
                            >
                                {uploading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <HiOutlineCloudUpload size={20} />
                                        Upload & Extract
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="glass-card-solid p-8 text-center animate-slide-up">
                    <div className="w-20 h-20 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <HiOutlineCheck className="text-accent-600 dark:text-accent-400" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">Upload Successful!</h3>
                    <p className="text-dark-500 dark:text-dark-400 mb-6">
                        Your document has been processed and transactions have been extracted.
                    </p>

                    {result && (
                        <div className="glass-card p-6 mb-6 text-left max-w-md mx-auto">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-dark-500">Transactions Found</span>
                                    <span className="font-medium text-dark-900 dark:text-white">
                                        {result.recentTransactions ? result.recentTransactions.length : 0}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-dark-500">Status</span>
                                    <span className="badge-success">Analyzed</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <button onClick={resetUpload} className="btn-primary">
                        Upload Another Document
                    </button>
                </div>
            )}

            {/* Instructions */}
            <div className="glass-card-solid p-6">
                <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-4">How It Works</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { step: '01', title: 'Upload PDF', desc: 'Upload your bank statement in PDF format' },
                        { step: '02', title: 'Auto Extract', desc: 'Our engine extracts all transactions automatically' },
                        { step: '03', title: 'Get Insights', desc: 'View categorized spending, trends, and risk alerts' },
                    ].map((item, i) => (
                        <div key={i} className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <span className="text-white font-bold text-sm">{item.step}</span>
                            </div>
                            <h4 className="font-semibold text-dark-900 dark:text-white">{item.title}</h4>
                            <p className="text-sm text-dark-400 mt-1">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Upload;
