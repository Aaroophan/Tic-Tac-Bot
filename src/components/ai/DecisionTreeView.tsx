import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface TreeNodeProps {
  node: any;
  depth: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, depth }) => {
  const [isExpanded, setIsExpanded] = useState(depth < 1);

  if (!node) return null;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="ml-4">
      <div 
        className="flex items-center cursor-pointer hover:bg-slate-700 dark:hover:bg-slate-700 rounded py-1"
        onClick={toggleExpand}
      >
        {node.children && node.children.length > 0 ? (
          isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
        ) : (
          <span className="w-4"></span>
        )}
        
        <div className="ml-1">
          <span className="text-sm">
            Move: {node.move !== undefined ? `Position ${node.move}` : 'Root'} 
            {node.score !== undefined && ` (Score: ${node.score})`}
          </span>
        </div>
      </div>
      
      {isExpanded && node.children && (
        <div className="border-l border-slate-300 dark:border-slate-600 pl-2">
          {node.children.map((child: any, index: number) => (
            <TreeNode key={index} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

interface DecisionTreeViewProps {
  tree: any;
}

const DecisionTreeView: React.FC<DecisionTreeViewProps> = ({ tree }) => {
  if (!tree) return null;

  return (
    <div className="max-h-60 overflow-auto p-2 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
      <TreeNode node={tree} depth={0} />
    </div>
  );
};

export default DecisionTreeView;