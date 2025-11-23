import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';
import { AnalysisResult } from '../types';

interface SafetyBadgeProps {
  result: AnalysisResult | null;
  loading: boolean;
  labels: {
    analyzing: string;
    safeTitle: string;
    mediumTitle: string;
    highTitle: string;
  };
}

export const SafetyBadge: React.FC<SafetyBadgeProps> = ({ result, loading, labels }) => {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-yellow-400 animate-pulse bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
        <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm">{labels.analyzing}</span>
      </div>
    );
  }

  if (!result) return null;

  if (result.riskLevel === 'HIGH') {
    return (
      <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 p-4 rounded-lg mt-2 text-red-400">
        <ShieldAlert className="shrink-0 mt-1" />
        <div>
          <h4 className="font-bold">{labels.highTitle}</h4>
          <p className="text-sm opacity-90">{result.message}</p>
        </div>
      </div>
    );
  }

  if (result.riskLevel === 'MEDIUM') {
    return (
      <div className="flex items-start gap-3 bg-orange-500/10 border border-orange-500/30 p-4 rounded-lg mt-2 text-orange-400">
        <AlertTriangle className="shrink-0 mt-1" />
        <div>
          <h4 className="font-bold">{labels.mediumTitle}</h4>
          <p className="text-sm opacity-90">{result.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg mt-2 text-emerald-400">
      <ShieldCheck className="shrink-0 mt-1" />
      <div>
        <h4 className="font-bold">{labels.safeTitle}</h4>
        <p className="text-sm opacity-90">{result.message}</p>
      </div>
    </div>
  );
};