function draw_panorama = IVA_draw_panorama(k, specific_pano, img_name, node_id)
node = [specific_pano.X specific_pano.Y specific_pano.FoV];
img = imread(fullfile('panoramas', img_name));
img = flip(img, 1);
% function plot_panorama = IVA_plot_panorama(input_x, input_y)
% Crtanje panorame(j)
scrsz = get(0,'ScreenSize');
set(gcf,'WindowStyle','normal','Renderer','painters',...
    'Position',[(scrsz(3)/2-300) -(scrsz(4)/2-150) 16386 8192],...
    'PaperPositionMode', 'manual','PaperUnits','centimeters',...
    'PaperSize',[577.991 289],'PaperPosition', [0 0 577.991 289],...
    'Color',[1,1,1]);
draw_panorama = imshow(img,'Border','tight');
hold on;
set(gca,'YDir','normal');
end