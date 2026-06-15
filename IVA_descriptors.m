tracking_data = readtable("input_data/Iva_Descriptors - Ulazni.csv");
idx = find(tracking_data.VisitorUUID == "b8d74397ae5e4e913f1d22964cbcc41f"); % Eliminisem moje podatke
tracking_data(idx,:) = [];
idx = find(tracking_data.VisitorUUID == "undefined"); % Eliminisem undefined users
tracking_data(idx,:) = [];

%% Changing the name of descriptors to correspond to those in the paper and deleting the untracked ones
tracking_data = IVA_f_convert_names_descriptors(tracking_data);
unique_D = unique(tracking_data.descriptor);

data = readtable("input_data/24 descriptors.csv");

%% Number of clicked buttons chart
X = data.Var1;
Y = data.Var3;
scrsz = get(0,'ScreenSize');
set(gcf, 'PaperUnits','centimeters', 'PaperSize',[210 297],...
    'Position',[100 100 600 300],...
    'PaperPositionMode', 'manual',...
    'PaperPosition', [0 0 210 297]);
set(gca, 'FontName','Times New Roman','FontSize',9);
h = histogram('Categories', X, 'BinCounts',...
    Y, 'EdgeColor','none','FaceColor',...
    [0 .5 .5] ,'FaceAlpha', 0.8 ,...
    'Orientation','vertical',...
    'BarWidth', 0.7);
xlabel('Descriptors', 'FontName', 'Times New Roman', 'FontSize', 9, 'horizontalAlignment', 'center');
ylabel('Accumulative number of clicks', 'FontName', 'Times New Roman', 'FontSize', 9, 'horizontalAlignment', 'center');
grid off;
