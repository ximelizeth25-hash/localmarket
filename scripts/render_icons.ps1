$csharpSource = @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

public static class IconRenderer
{
    public static void GenerateIcon(int size, string outputPath, bool maskable)
    {
        using (Bitmap bmp = new Bitmap(size, size))
        using (Graphics g = Graphics.FromImage(bmp))
        {
            g.SmoothingMode = SmoothingMode.AntiAlias;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;

            // Background
            g.Clear(Color.FromArgb(15, 23, 42)); // Slate 900

            float margin = maskable ? (size * 0.12f) : (size * 0.04f);
            float x = margin;
            float y = margin;
            float w = size - (2f * margin);
            float h = size - (2f * margin);

            RectangleF rect = new RectangleF(x, y, w, h);
            float radius = w * 0.22f;

            using (GraphicsPath path = GetRoundedRect(rect, radius))
            using (LinearGradientBrush brush = new LinearGradientBrush(
                new PointF(x, y),
                new PointF(x + w, y + h),
                Color.FromArgb(2, 132, 199),   // Sky 600
                Color.FromArgb(16, 185, 129))) // Emerald 500
            {
                g.FillPath(brush, path);

                // Subtle inner glow
                using (Pen glowPen = new Pen(Color.FromArgb(80, 255, 255, 255), Math.Max(1.5f, size * 0.015f)))
                {
                    g.DrawPath(glowPen, path);
                }
            }

            // Draw Store Icon
            float cx = size / 2f;
            float cy = size / 2f;
            float emblem = w * 0.52f;

            using (SolidBrush whiteBrush = new SolidBrush(Color.White))
            using (SolidBrush accentBrush = new SolidBrush(Color.FromArgb(240, 253, 244)))
            {
                // Roof
                PointF[] roofPoints = new PointF[]
                {
                    new PointF(cx, cy - (emblem * 0.42f)),
                    new PointF(cx + (emblem * 0.46f), cy - (emblem * 0.10f)),
                    new PointF(cx - (emblem * 0.46f), cy - (emblem * 0.10f))
                };
                g.FillPolygon(whiteBrush, roofPoints);

                // Pillars
                float pillarW = Math.Max(3f, emblem * 0.12f);
                float pillarH = emblem * 0.40f;
                float pillarY = cy - (emblem * 0.06f);

                g.FillRectangle(accentBrush, cx - (emblem * 0.40f), pillarY, pillarW, pillarH);
                g.FillRectangle(accentBrush, cx - (pillarW / 2f), pillarY, pillarW, pillarH);
                g.FillRectangle(accentBrush, cx + (emblem * 0.40f) - pillarW, pillarY, pillarW, pillarH);

                // Base
                float baseW = emblem * 0.94f;
                float baseH = Math.Max(3f, emblem * 0.10f);
                float baseY = pillarY + pillarH + (emblem * 0.04f);
                g.FillRectangle(whiteBrush, cx - (baseW / 2f), baseY, baseW, baseH);
            }

            bmp.Save(outputPath, ImageFormat.Png);
        }
    }

    private static GraphicsPath GetRoundedRect(RectangleF r, float radius)
    {
        GraphicsPath path = new GraphicsPath();
        float d = radius * 2f;
        path.AddArc(r.X, r.Y, d, d, 180, 90);
        path.AddArc(r.Right - d, r.Y, d, d, 270, 90);
        path.AddArc(r.Right - d, r.Bottom - d, d, d, 0, 90);
        path.AddArc(r.X, r.Bottom - d, d, d, 90, 90);
        path.CloseFigure();
        return path;
    }
}
"@

Add-Type -TypeDefinition $csharpSource -ReferencedAssemblies System.Drawing

[IconRenderer]::GenerateIcon(192, "public\icons\icon-192.png", $false)
[IconRenderer]::GenerateIcon(512, "public\icons\icon-512.png", $false)
[IconRenderer]::GenerateIcon(192, "public\icons\icon-maskable-192.png", $true)
[IconRenderer]::GenerateIcon(512, "public\icons\icon-maskable-512.png", $true)
[IconRenderer]::GenerateIcon(180, "public\icons\apple-touch-icon.png", $false)
[IconRenderer]::GenerateIcon(64, "public\icons\favicon.png", $false)

Copy-Item "public\icons\favicon.png" "public\favicon.png" -Force
Write-Output "ALL_ICONS_RENDERED_SUCCESSFULLY"
