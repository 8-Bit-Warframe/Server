SET project_path=%1
%project_path:~1,2%
cd %project_path% && rd /s /q "dist"
cd %project_path% && gulp