import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorksStore, getProjectCategories, getMockWorks, WorkStatus, OperationLog } from '../store/useStore';

const isAdmin = true;

const projectData = [
  { id: 1, title: '短视频' },
  { id: 2, title: '宣传视频' },
  { id: 3, title: '商业摄影' },
  { id: 4, title: '人像摄影' },
  { id: 5, title: '文字编辑' },
  { id: 6, title: '合作品牌' },
];

const sortOptions = [
  { type: 'custom', label: '自定义排序' },
  { type: 'createdAt', label: '按创建时间' },
  { type: 'updatedAt', label: '按更新时间' },
  { type: 'views', label: '按浏览量' },
  { type: 'title', label: '按标题' }
];

const statusLabels: Record<WorkStatus, { label: string; color: string }> = {
  normal: { label: '正常', color: 'bg-green-600' },
  hidden: { label: '已隐藏', color: 'bg-yellow-600' },
  deleted: { label: '已删除', color: 'bg-red-600' }
};

const actionLabels: Record<string, string> = {
  hide: '隐藏',
  show: '显示',
  delete: '删除',
  restore: '恢复',
  reorder: '重排'
};

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function Admin() {
  const {
    works, hiddenWorks, deletedWorks, operationLogs,
    addWork, hideWork, showWork, deleteWork, restoreWork,
    batchHideWorks, batchShowWorks, batchDeleteWorks,
    getWorksByProject, sortWorks, reorderWorks,
    getOperationLogs, clearOperationLogs, getWorkStatus
  } = useWorksStore();

  const [selectedProject, setSelectedProject] = useState<number>(1);
  const [showUploadForm, setShowUploadForm] = useState<boolean>(false);
  const [currentFiles, setCurrentFiles] = useState<File[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [albumTitle, setAlbumTitle] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<WorkStatus | 'all'>('all');
  const [selectedWorks, setSelectedWorks] = useState<Set<string>>(new Set());
  const [sortType, setSortType] = useState<string>('custom');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [isReordering, setIsReordering] = useState<boolean>(false);
  const [showLogs, setShowLogs] = useState<boolean>(false);

  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    type: 'hide' | 'show' | 'delete' | 'batch-hide' | 'batch-show' | 'batch-delete';
    ids: string[];
    title?: string;
  }>({ show: false, type: 'hide', ids: [] });

  const mockWorks = getMockWorks();
  const categories = getProjectCategories(selectedProject);

  const getAllWorksForProject = () => {
    const mockProjectWorks = mockWorks.filter(w => w.projectId === selectedProject);
    const userProjectWorks = getWorksByProject(selectedProject);
    return [...mockProjectWorks, ...userProjectWorks];
  };

  const getFilteredWorks = () => {
    let allWorks = getAllWorksForProject();

    if (statusFilter !== 'all') {
      allWorks = allWorks.filter(w => getWorkStatus(w.id) === statusFilter);
    }

    return sortWorks(allWorks, sortType as any, sortOrder as any);
  };

  const filteredWorks = getFilteredWorks();

  const handleSelectWork = (id: string) => {
    const newSelected = new Set(selectedWorks);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedWorks(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedWorks.size === filteredWorks.length) {
      setSelectedWorks(new Set());
    } else {
      setSelectedWorks(new Set(filteredWorks.map(w => w.id)));
    }
  };

  const handleConfirm = () => {
    const { type, ids } = confirmDialog;

    let result;
    switch (type) {
      case 'hide':
        result = hideWork(ids[0]);
        if (result.success) setSuccessMessage('作品已隐藏');
        break;
      case 'show':
        result = showWork(ids[0]);
        if (result.success) setSuccessMessage('作品已显示');
        break;
      case 'delete':
        result = deleteWork(ids[0]);
        if (result.success) setSuccessMessage('作品已删除');
        break;
      case 'batch-hide':
        result = batchHideWorks(ids);
        if (result.success) setSuccessMessage(`已隐藏 ${result.count} 个作品`);
        break;
      case 'batch-show':
        result = batchShowWorks(ids);
        if (result.success) setSuccessMessage(`已显示 ${result.count} 个作品`);
        break;
      case 'batch-delete':
        result = batchDeleteWorks(ids);
        if (result.success) setSuccessMessage(`已删除 ${result.count} 个作品`);
        break;
    }

    if (result && !result.success) {
      setErrorMessage(result.error || '操作失败');
    }

    setSelectedWorks(new Set());
    setConfirmDialog({ show: false, type: 'hide', ids: [] });
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleMoveUp = (index: number, worksList: any[]) => {
    if (index === 0) return;
    const newOrder = worksList.map(w => w.id);
    const temp = newOrder[index];
    newOrder[index] = newOrder[index - 1];
    newOrder[index - 1] = temp;
    reorderWorks(selectedProject, worksList[0].categoryId, newOrder);
  };

  const handleMoveDown = (index: number, worksList: any[]) => {
    if (index === worksList.length - 1) return;
    const newOrder = worksList.map(w => w.id);
    const temp = newOrder[index];
    newOrder[index] = newOrder[index + 1];
    newOrder[index + 1] = temp;
    reorderWorks(selectedProject, worksList[0].categoryId, newOrder);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setErrorMessage(null);
    setFilePreview(null);
    setFileContent(null);

    const maxSize = 10 * 1024 * 1024;
    for (const file of files) {
      if (file.size > maxSize) {
        setErrorMessage(`文件 ${file.name} 超过10MB限制`);
        return;
      }
    }

    const file = files[0];
    setCurrentFiles([file]);
    setAlbumTitle(file.name.replace(/\.[^/.]+$/, ''));

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (e) => setFileContent(e.target?.result as string);
      reader.readAsText(file);
      setFilePreview(`https://picsum.photos/400/225?random=${Date.now()}`);
    } else {
      setFilePreview(`https://picsum.photos/400/225?random=${Date.now()}`);
    }

    setShowUploadForm(true);
  };

  const clearForm = () => {
    setCurrentFiles([]);
    setAlbumTitle('');
    setSelectedCategory('');
    setShowUploadForm(false);
    setIsUploading(false);
    setUploadProgress(0);
    setFilePreview(null);
    setFileContent(null);
  };

  const handleUpload = () => {
    if (!isAdmin) {
      setErrorMessage('您没有权限执行此操作');
      return;
    }

    if (currentFiles.length === 0) {
      setErrorMessage('请选择要上传的文件');
      return;
    }

    if (!selectedCategory) {
      setErrorMessage('请选择一个分类');
      return;
    }

    if (!albumTitle.trim()) {
      setErrorMessage('请输入作品标题');
      return;
    }

    setErrorMessage(null);
    setIsUploading(true);
    setUploadProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);

        const thumbnail = filePreview || `https://picsum.photos/400/225?random=${Date.now()}`;
        const workType = fileContent ? 'text' : (currentFiles[0].type.startsWith('image/') ? 'album' : 'video');

        const result = addWork({
          projectId: selectedProject,
          categoryId: selectedCategory,
          title: albumTitle.trim(),
          thumbnail,
          type: workType,
          content: fileContent || undefined,
          files: currentFiles,
          count: currentFiles[0].type.startsWith('image/') ? currentFiles.length : undefined
        });

        setIsUploading(false);

        if (result.success) {
          setSuccessMessage('上传成功！');
          clearForm();
          setTimeout(() => setSuccessMessage(null), 3000);
        } else {
          setErrorMessage(result.error || '上传失败');
        }
      }
    }, 100);
  };

  const stats = {
    total: getAllWorksForProject().length,
    normal: getAllWorksForProject().filter(w => getWorkStatus(w.id) === 'normal').length,
    hidden: getAllWorksForProject().filter(w => getWorkStatus(w.id) === 'hidden').length,
    deleted: getAllWorksForProject().filter(w => getWorkStatus(w.id) === 'deleted').length
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  const getWorkTitle = (id: string) => {
    const work = [...mockWorks, ...works].find(w => w.id === id);
    return work?.title || id;
  };

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="text-zinc-400 text-sm hover:text-zinc-300 mb-4 inline-block">
            ← 返回首页
          </Link>
          <h1 className="text-3xl font-bold">作品管理</h1>
        </div>

        <div className="bg-zinc-900 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">选择项目</h2>
          <div className="flex flex-wrap gap-2">
            {projectData.map((project) => (
              <button
                key={project.id}
                onClick={() => {
                  setSelectedProject(project.id);
                  clearForm();
                  setSelectedWorks(new Set());
                  setStatusFilter('all');
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedProject === project.id ? 'bg-white text-zinc-900' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
              >
                {project.title}
              </button>
            ))}
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-green-900/30 border border-green-500/50 rounded-lg text-green-400 text-sm">
            {successMessage}
          </div>
        )}

        <div className="bg-zinc-900 rounded-xl p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-4 text-sm">
              <span className="text-zinc-400">总计: <span className="text-white font-medium">{stats.total}</span></span>
              <span className="text-green-400">正常: {stats.normal}</span>
              <span className="text-yellow-400">已隐藏: {stats.hidden}</span>
              <span className="text-red-400">已删除: {stats.deleted}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as WorkStatus | 'all')}
                className="bg-zinc-800 text-white px-3 py-1.5 rounded-lg text-sm"
              >
                <option value="all">全部状态</option>
                <option value="normal">正常</option>
                <option value="hidden">已隐藏</option>
                <option value="deleted">已删除</option>
              </select>
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="bg-zinc-800 text-white px-3 py-1.5 rounded-lg text-sm"
              >
                {sortOptions.map(opt => (
                  <option key={opt.type} value={opt.type}>{opt.label}</option>
                ))}
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="bg-zinc-800 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-zinc-700"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
              <button
                onClick={() => setShowLogs(!showLogs)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium ${showLogs ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
              >
                操作日志
              </button>
            </div>
          </div>

          {selectedWorks.size > 0 && (
            <div className="mt-4 pt-4 border-t border-zinc-700 flex items-center gap-3">
              <span className="text-sm text-zinc-300">已选择 {selectedWorks.size} 个作品</span>
              <button
                onClick={() => setConfirmDialog({ show: true, type: 'batch-hide', ids: Array.from(selectedWorks) })}
                className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700"
              >
                批量隐藏
              </button>
              <button
                onClick={() => setConfirmDialog({ show: true, type: 'batch-show', ids: Array.from(selectedWorks) })}
                className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
              >
                批量显示
              </button>
              <button
                onClick={() => setConfirmDialog({ show: true, type: 'batch-delete', ids: Array.from(selectedWorks) })}
                className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
              >
                批量删除
              </button>
              <button
                onClick={() => setSelectedWorks(new Set())}
                className="px-3 py-1 bg-zinc-700 text-zinc-300 rounded-lg text-sm hover:bg-zinc-600"
              >
                取消选择
              </button>
            </div>
          )}
        </div>

        {showLogs && (
          <div className="bg-zinc-900 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">操作日志</h3>
              <button
                onClick={() => clearOperationLogs()}
                className="text-sm text-red-400 hover:text-red-300"
              >
                清空日志
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {operationLogs.length === 0 ? (
                <p className="text-zinc-500 text-sm">暂无操作记录</p>
              ) : (
                operationLogs.slice(0, 20).map((log) => (
                  <div key={log.id} className="flex items-center gap-3 text-sm p-2 bg-zinc-800 rounded">
                    <span className="px-2 py-0.5 bg-zinc-700 rounded text-xs text-zinc-300">
                      {actionLabels[log.action]}
                    </span>
                    <span className="text-zinc-300 truncate flex-1">{log.workTitle}</span>
                    <span className="text-zinc-500 text-xs">{formatTime(log.timestamp)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {showUploadForm && (
          <div className="bg-zinc-900 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">上传作品</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-zinc-300 text-sm mb-2">作品标题</label>
                <input
                  type="text"
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="请输入作品标题"
                />
              </div>

              {filePreview && (
                <div>
                  <label className="block text-zinc-300 text-sm mb-2">预览</label>
                  <div className="bg-zinc-800 rounded-lg p-2">
                    <img src={filePreview} alt="预览" className="w-full max-h-40 object-contain rounded" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-zinc-300 text-sm mb-2">选择分类</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.id ? 'bg-white text-zinc-900' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {isUploading && (
                <div>
                  <div className="w-full bg-zinc-700 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                  <p className="text-zinc-400 text-xs mt-1">{uploadProgress}%</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleUpload}
                  disabled={isUploading || !selectedCategory}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${isUploading || !selectedCategory ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed' : 'bg-white text-zinc-900 hover:bg-zinc-100'}`}
                >
                  {isUploading ? '上传中...' : '确认上传'}
                </button>
                <button
                  onClick={clearForm}
                  className="px-6 py-2 rounded-lg text-sm font-medium bg-zinc-700 text-zinc-300 hover:bg-zinc-600 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}

        {!showUploadForm && (
          <div className="bg-zinc-900 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">上传文件</h3>
            <div className="relative">
              <input
                type="file"
                accept="*/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="border-2 border-dashed border-zinc-700 rounded-xl p-8 text-center hover:border-zinc-600 transition-colors">
                <p className="text-zinc-400">点击或拖拽文件到此处上传</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-zinc-900 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">作品列表</h2>
            <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedWorks.size === filteredWorks.length && filteredWorks.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded"
              />
              全选
            </label>
          </div>

          {filteredWorks.length === 0 ? (
            <p className="text-zinc-500 text-center py-8">暂无作品</p>
          ) : (
            <div className="space-y-2">
              {filteredWorks.map((work) => {
                const status = getWorkStatus(work.id);
                const isSelected = selectedWorks.has(work.id);

                return (
                  <div
                    key={work.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isSelected ? 'bg-zinc-700' : 'bg-zinc-800 hover:bg-zinc-750'}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectWork(work.id)}
                      className="w-4 h-4 rounded"
                    />

                    <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0">
                      <img src={work.thumbnail} alt={work.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm truncate">{work.title}</h4>
                      <p className="text-zinc-400 text-xs">
                        {getCategoryName(work.categoryId)} · {work.type === 'album' ? '相册' : work.type === 'text' ? '文字' : '视频'} · 浏览: {work.views}
                        {work.id.startsWith('mock-') && <span className="ml-2 text-zinc-500">(参考)</span>}
                      </p>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-xs text-white ${statusLabels[status].color}`}>
                      {statusLabels[status].label}
                    </span>

                    <div className="flex items-center gap-1">
                      {status === 'hidden' && (
                        <button
                          onClick={() => setConfirmDialog({ show: true, type: 'show', ids: [work.id], title: work.title })}
                          className="p-2 text-green-400 hover:bg-zinc-700 rounded"
                          title="显示"
                        >
                          👁
                        </button>
                      )}
                      {status === 'normal' && (
                        <button
                          onClick={() => setConfirmDialog({ show: true, type: 'hide', ids: [work.id], title: work.title })}
                          className="p-2 text-yellow-400 hover:bg-zinc-700 rounded"
                          title="隐藏"
                        >
                          👁‍🗨
                        </button>
                      )}
                      {status === 'deleted' && (
                        <button
                          onClick={() => {
                            const result = restoreWork(work.id);
                            if (result.success) setSuccessMessage('作品已恢复');
                          }}
                          className="p-2 text-green-400 hover:bg-zinc-700 rounded"
                          title="恢复"
                        >
                          ↩
                        </button>
                      )}
                      <button
                        onClick={() => setConfirmDialog({ show: true, type: 'delete', ids: [work.id], title: work.title })}
                        className="p-2 text-red-400 hover:bg-zinc-700 rounded"
                        title="删除"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {confirmDialog.show && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setConfirmDialog({ show: false, type: 'hide', ids: [] })}>
          <div className="bg-zinc-900 rounded-xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">确认操作</h3>
            <p className="text-zinc-300 mb-6">
              {confirmDialog.type === 'hide' && `确定要隐藏作品 "${confirmDialog.title}" 吗？`}
              {confirmDialog.type === 'show' && `确定要显示作品 "${confirmDialog.title}" 吗？`}
              {confirmDialog.type === 'delete' && `确定要删除作品 "${confirmDialog.title}" 吗？此操作不可撤销。`}
              {confirmDialog.type === 'batch-hide' && `确定要隐藏选中的 ${confirmDialog.ids.length} 个作品吗？`}
              {confirmDialog.type === 'batch-show' && `确定要显示选中的 ${confirmDialog.ids.length} 个作品吗？`}
              {confirmDialog.type === 'batch-delete' && `确定要删除选中的 ${confirmDialog.ids.length} 个作品吗？此操作不可撤销。`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDialog({ show: false, type: 'hide', ids: [] })}
                className="flex-1 px-4 py-2 rounded-lg bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
              >
                取消
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}