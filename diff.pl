#!/usr/bin/env perl
use strict;
use warnings;
use File::Temp qw();
use File::Find qw();
use File::Spec qw();
use FindBin;
use feature qw( say );

my ($left, $right) = @ARGV;
my @items;
my $WAIT_AFTER_LAUNCH = 1;

chdir $FindBin::Bin;
my $js = load_js();
my $tmpl = load_tmpl();

if ( -f $left ) {
    push @items, element_for_files($left, $right, $left)
}
elsif ( -d $left ) {
    $WAIT_AFTER_LAUNCH = 5;
    my %left;
    my %right;
    File::Find::find({
        wanted => sub {
            return unless -f $File::Find::name;
            $left{ File::Spec->abs2rel($File::Find::name, $left) } = 1;
        }
    }, $left);
    File::Find::find({
        wanted => sub {
            return unless -f $File::Find::name;
            $right{ File::Spec->abs2rel($File::Find::name, $right) } = 1;
        }
    }, $right);
    my %done;
    for my $filepath ( keys %left ) {
        my $leftpath = File::Spec->catfile($left, $filepath);
        my $rightpath = $right{$filepath} ? File::Spec->catfile($right, $filepath)
                                          : File::Spec->devnull
                                          ;
        push @items, element_for_files($leftpath, $rightpath, $filepath);
        $done{$filepath} = 1;
    }
    for my $filepath ( keys %right ) {
        next if $done{$filepath};
        push @items, element_for_files(File::Spec->devnull, File::Spec->catfile($right, $filepath), $filepath);
    }
}

my $items = join( '', map { $_->[1] } sort { $a->[0] cmp $b->[0] } @items );
$tmpl =~ s/<!-- __ITEMS__ -->/$items/;
$tmpl =~ s/<!-- __MAXPAT2SVG__ -->/$js/;
open_tmp_html($tmpl);
sleep $WAIT_AFTER_LAUNCH; # FIXME: Here it need to make sure browser received entire page content, but how?

sub load_js {
    open my $fh, '<', './maxpat2svg.js';
    my $js = do { local $/; <$fh> };
    close $fh;
    return $js;
}

sub load_tmpl {
    open my $fh, '<', './diff.html';
    my $tmpl = do { local $/; <$fh> };
    close $fh;
    return $tmpl;
}

sub element_for_files {
    my ($left, $right, $name) = @_;
    my ($left_content, $right_content) = ('{}', '{}');
    if ( -f $left ) {
        open my $fh_left, '<', $left;
        $left_content = do { local $/; <$fh_left> };
        close $fh_left;
    }
    if ( -f $right ) {
        open my $fh_right, '<', $right;
        $right_content = do { local $/; <$fh_right> };
        close $fh_right;
    }
    my $name_ = $name;
    $name_ =~ s/"/&quot;/g;
    $left_content =~ s/"/&quot;/g;
    $right_content =~ s/"/&quot;/g;
    return [
        $name_,
        qq{<li class="diff-item" data-left="$left_content" data-right="$right_content" data-name="$name_"></li>},
    ]
}

sub open_tmp_html {
    my ($content) = @_;
    my ($fh, $filename) = File::Temp::tempfile( 'tmp_XXXXXXXX', SUFFIX => '.html', UNLINK => 1 );
    print $fh $content;
    `explorer $filename`;
}
